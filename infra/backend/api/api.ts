import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from "aws-cdk-lib/aws-logs";
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Schedule } from 'aws-cdk-lib/aws-events';

export class Api extends Construct {
    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id);

        const service = this.createEcsFaragate(scope, props);
        this.createApiGateway(props, service);
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

        const loadBalancer = new ApplicationLoadBalancer(scope, `${props.serviceName}-alb`, {
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
        const api = new apigateway.RestApi(this, 'api-gateway', {
            restApiName: 'Todo Service',
            description: 'This service serves todos.'
        });

        const todos = api.root.addResource('todos');

        const listIntegration = new apigateway.HttpIntegration('http-integration', {
            proxy: true,
            options: {
                connectionType: apigateway.ConnectionType.VPC_LINK,
                integrationResponses: [
                    {
                        statusCode: '200'
                    }
                ]
            }
        });
    }
}

export interface ApiProps {
    serviceName: string;
    region: string;
    vpc: ec2.IVpc;
    ecr: EcrProps;
    ecsFargate: EcsFargateProps;
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