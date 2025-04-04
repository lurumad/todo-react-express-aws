import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from "aws-cdk-lib/aws-logs";
import * as codedeploy from "aws-cdk-lib/aws-codedeploy";
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Schedule } from 'aws-cdk-lib/aws-events';

export class Api extends Construct {
    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id);

        const service = this.createEcsFaragate(scope, props);
        this.createApiGateway(props, service);
        this.createDeployment(scope, props, service);
    }

    private createEcsFaragate(scope: Construct, props: ApiProps): ecs_patterns.ApplicationLoadBalancedFargateService {
        const connServiceExecRole = new iam.Role(
            scope,
            `${props.serviceName}ExecutionRole`,
            {
                assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
                roleName: `${props.serviceName}ExecutionRole`,
                inlinePolicies: {
                    PullFromECRPolicy: new iam.PolicyDocument({
                        statements: [
                            new iam.PolicyStatement({
                                actions: [
                                    "ecr:BatchCheckLayerAvailability",
                                    "ecr:BatchGetImage",
                                    "ecr:GetDownloadUrlForLayer",
                                ],
                                effect: iam.Effect.ALLOW,
                                resources: [props.ecr.repo.repositoryArn],
                            }),
                            new iam.PolicyStatement({
                                actions: ["ecr:GetAuthorizationToken"],
                                effect: iam.Effect.ALLOW,
                                resources: ["*"],
                            }),
                        ],
                    }),
                    MetricsAndLoggingPolicy: new iam.PolicyDocument({
                        statements: [
                            new iam.PolicyStatement({
                                actions: [
                                    "logs:CreateLogStream",
                                    "logs:PutLogEvents",
                                    "cloudwatch:PutMetricData",
                                    "cloudwatch:PutMetricStream",
                                ],
                                effect: iam.Effect.ALLOW,
                                resources: ["*"],
                            }),
                        ],
                    }),
                    XRayPolicy: new iam.PolicyDocument({
                        statements: [new iam.PolicyStatement({
                            actions: [
                                "xray:PutTraceSegments",
                                "xray:PutTelemetryRecords",
                                "xray:GetSamplingRules",
                                "xray:GetSamplingTargets",
                                "xray:GetSamplingStatisticSummaries",
                            ],
                            effect: iam.Effect.ALLOW,
                            resources: ["*"],
                        })],
                    }),
                    DynamoDBPolicy: new iam.PolicyDocument({
                        statements: [new iam.PolicyStatement({
                            effect: iam.Effect.ALLOW,
                            actions: [
                                'dynamodb:BatchGetItem',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:PutItem',
                                'dynamodb:GetItem',
                                'dynamodb:Query',
                                'dynamodb:Scan',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                            ],
                            resources: [props.table.tableArn, `${props.table.tableArn}/index/*`]
                        })],
                    }),
                },
            }
        );

        const cluster = new ecs.Cluster(scope, `${props.serviceName}-Cluster`, {
            vpc: props.vpc,
            clusterName: `${props.serviceName}-Cluster`,
            containerInsights:
                props.ecsFargate != null
                    ? props.ecsFargate.enableContainerInsights
                    : true,
        });

        const loadBalancer = new elbv2.ApplicationLoadBalancer(scope, `${props.serviceName}-alb`, {
            vpc: props.vpc,
            crossZoneEnabled: true,
            internetFacing: false,
            loadBalancerName: `${props.serviceName}-alb`,
            deletionProtection: true,
        });

        const logGroup = new logs.LogGroup(scope, `${props.serviceName}-log-group`, {
            logGroupName: props.serviceName,
            retention: props.ecsFargate.logRetention || logs.RetentionDays.ONE_MONTH,
        });

        const logDriver = new ecs.AwsLogDriver({
            logGroup: logGroup,
            streamPrefix: props.serviceName,
        });

        const albApplication = new ecs_patterns.ApplicationLoadBalancedFargateService(
            scope,
            props.serviceName,
            {
                cluster: cluster,
                cpu: props.ecsFargate.containerConfiguration.cpu,
                ephemeralStorageGiB: props.ecsFargate.ephemeralStorageGiB,
                desiredCount: props.ecsFargate.containerConfiguration.desiredInstances,
                loadBalancer: loadBalancer,
                taskImageOptions: {
                    image: ecs.ContainerImage.fromEcrRepository(
                        props.ecr.repo,
                        props.ecr.imageTag
                    ),
                    containerPort: props.ecsFargate.containerConfiguration.containerPort,
                    executionRole: connServiceExecRole,
                    taskRole: connServiceExecRole,
                    environment: props.ecsFargate.environmentVariables,
                    secrets: props.ecsFargate.secrets,
                    enableLogging: true,
                    logDriver: logDriver,
                },
                memoryLimitMiB: props.ecsFargate.containerConfiguration.memoryLimitMiB,
                publicLoadBalancer: false,
                listenerPort: props.ecsFargate.containerConfiguration.externalListenerPort,
                serviceName: props.serviceName,
                deploymentController: {
                    type: props.ecsFargate.deploymentController,
                },
            }
        );

        albApplication.targetGroup.configureHealthCheck({
            enabled: true,
            timeout: cdk.Duration.seconds(5),
            path: "/ping",
            interval: cdk.Duration.seconds(30),
            unhealthyThresholdCount: 2,
            healthyThresholdCount: 5,
            protocol: elbv2.Protocol.HTTP,
        });

        albApplication.service.taskDefinition.defaultContainer?.addUlimits({
            name: ecs.UlimitName.NOFILE,
            softLimit: 1048576,
            hardLimit: 1048576,
        });

        if (props.ecsFargate.containerConfiguration.scaling) {
            const scalingPolicy = albApplication.service.autoScaleTaskCount({
                minCapacity: props.ecsFargate.containerConfiguration.scaling.minCapacity,
                maxCapacity: props.ecsFargate.containerConfiguration.scaling.maxCapacity,
            });

            if (props.ecsFargate.containerConfiguration.scaling.cpuTargetUtilizationPercent) {
                scalingPolicy.scaleOnCpuUtilization("cpu-scaling", {
                    targetUtilizationPercent: props.ecsFargate.containerConfiguration.scaling.cpuTargetUtilizationPercent,
                });
            }

            if (props.ecsFargate.containerConfiguration.scaling.memoryTargetUtilizationPercent) {
                scalingPolicy.scaleOnMemoryUtilization("memory-scaling", {
                    targetUtilizationPercent:
                        props.ecsFargate.containerConfiguration.scaling.memoryTargetUtilizationPercent,
                });
            }

            if (props.ecsFargate.containerConfiguration.scaling.schedule) {
                scalingPolicy.scaleOnSchedule("ScaleDown", {
                    schedule: Schedule.cron({
                        hour: props.ecsFargate.containerConfiguration.scaling.schedule.scaleDown.hour,
                        minute: props.ecsFargate.containerConfiguration.scaling.schedule.scaleDown.minute,
                    }),
                    minCapacity: props.ecsFargate.containerConfiguration.scaling.schedule.scaleDown.minCapacity,
                });
                scalingPolicy.scaleOnSchedule("ScaleUp", {
                    schedule: Schedule.cron({
                        hour: props.ecsFargate.containerConfiguration.scaling.schedule.scaleUp.hour,
                        minute: props.ecsFargate.containerConfiguration.scaling.schedule.scaleUp.minute,
                    }),
                    minCapacity: props.ecsFargate.containerConfiguration.scaling.schedule.scaleUp.minCapacity,
                });
            }
        }

        albApplication.service.connections.allowFromAnyIpv4(
            ec2.Port.tcp(props.ecsFargate.containerConfiguration.containerPort)
        );

        return albApplication;
    }

    private createApiGateway(props: ApiProps, service: ecs_patterns.ApplicationLoadBalancedFargateService) {
        const api = new apigatewayv2.HttpApi(this, 'TodosApi', {
            corsPreflight: {
                allowHeaders: ['Authorization', 'Content-Type'],
                allowMethods: [apigatewayv2.CorsHttpMethod.GET, apigatewayv2.CorsHttpMethod.POST, apigatewayv2.CorsHttpMethod.PUT, apigatewayv2.CorsHttpMethod.DELETE],
                allowOrigins: ['https://todos.luisruizpavon.com'],
            }
        });

        const vpcLink = api.addVpcLink({
            vpcLinkName: 'TodosVpcLink',
            vpc: props.vpc,
            securityGroups: service.service.connections.securityGroups,
        });

        api.addRoutes({
            path: '/{proxy+}',
            methods: [apigatewayv2.HttpMethod.ANY],
            integration: new integrations.HttpAlbIntegration('TodosAlbIntegration', service.listener, {
                vpcLink: vpcLink,
            }),
        });


    }

    private createDeployment(scope: Construct, props: ApiProps, service: ecs_patterns.ApplicationLoadBalancedFargateService) {
        const application = new codedeploy.EcsApplication(scope, `${props.serviceName}-deployment-app`, {
            applicationName: `${props.serviceName}-deployment-app`,
        });

        const greenTG = new elbv2.ApplicationTargetGroup(scope, `${props.serviceName}-green-tg`, {
            targetGroupName: `${props.serviceName}-green-tg`,
            port: props.ecsFargate.containerConfiguration.containerPort,
            vpc: props.vpc,
            protocol: elbv2.ApplicationProtocol.HTTP,
            targetType: elbv2.TargetType.IP,
        });

        greenTG.configureHealthCheck({
            enabled: true,
            timeout: cdk.Duration.seconds(5),
            path: "/ping",
            interval: cdk.Duration.seconds(30),
            unhealthyThresholdCount: 2,
            healthyThresholdCount: 5,
            protocol: elbv2.Protocol.HTTP,
        });

        const testListener = new elbv2.ApplicationListener(scope, `${props.serviceName}-test-listener`, {
            loadBalancer: service.loadBalancer,
            port: 8080,
            protocol: elbv2.ApplicationProtocol.HTTP,
            defaultTargetGroups: [service.targetGroup],
        });

        const deploymentGroup = new codedeploy.EcsDeploymentGroup(scope, `${props.serviceName}-deployment-group`, {
            application: application,
            deploymentGroupName: `${props.serviceName}-deployment-group`,
            service: service.service,
            deploymentConfig: codedeploy.EcsDeploymentConfig.CANARY_10PERCENT_5MINUTES,
            blueGreenDeploymentConfig: {
                blueTargetGroup: service.targetGroup,
                greenTargetGroup: greenTG,
                listener: service.listener,
                testListener: testListener,
                terminationWaitTime: cdk.Duration.seconds(60)
            },
        });

        return deploymentGroup;
    }
}

export interface ApiProps {
    serviceName: string;
    region: string;
    vpc: ec2.IVpc;
    ecr: EcrProps;
    ecsFargate: EcsFargateProps;
    table: dynamodb.Table;
}

export class EcrProps {
    repo: ecr.IRepository;
    imageTag: string;
}

export class EcsFargateProps {
    enableContainerInsights?: boolean;
    additionalPermissions?: iam.PolicyStatement[];
    containerConfiguration: ContainerConfiguration;
    deploymentController: ecs.DeploymentControllerType;
    environmentVariables?: { [key: string]: string };
    secrets?: { [key: string]: ecs.Secret };
    logRetention?: logs.RetentionDays;
    ephemeralStorageGiB?: number;
}

export class ContainerConfiguration {
    externalListenerPort: number;
    containerPort: number;
    memoryLimitMiB: number;
    cpu: number;
    desiredInstances: number;
    scaling?: {
        minCapacity: number;
        maxCapacity: number;
        cpuTargetUtilizationPercent?: number;
        memoryTargetUtilizationPercent?: number;
        schedule?: {
            scaleUp: {
                hour: string;
                minute: string;
                minCapacity: number;
            };
            scaleDown: {
                hour: string;
                minute: string;
                minCapacity: number;
            };
        };
    };
}