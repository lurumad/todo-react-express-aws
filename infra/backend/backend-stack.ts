import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
import { Database } from './database/database';
import { Api } from './api/api';
import { Networking } from './networking/networking';

export class BackendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);
        const ecrRepo = ecr.Repository.fromRepositoryName(this, 'TodosEcrRepo', props.repositoryName);

        const networking = new Networking(this, 'NetworkingConstruct');

        const database = new Database(this, 'DatabaseConstruct', {
            tableName: props.tableName,
        });

        const api = new Api(this, 'ApiConstruct', {
            table: database.table,
            serviceName: props.serviceName,
            region: this.region,
            ecr: {
                repo: ecrRepo,
                imageTag: props.imageTag,
            },
            vpc: networking.vpc,
            ecsFargate: {
                enableContainerInsights: false,
                additionalPermissions: [],
                containerConfiguration: {
                    externalListenerPort: 80,
                    containerPort: 3001,
                    cpu: 256,
                    memoryLimitMiB: 512,
                    desiredInstances: 1,
                },
                deploymentController: ecs.DeploymentControllerType.CODE_DEPLOY,
                environmentVariables: {
                    NODE_ENV: 'production',
                    PORT: '3001',
                    TABLE_NAME: props.tableName,
                    AWS_REGION: this.region,
                },
                logRetention: logs.RetentionDays.ONE_DAY
            }
        });
    }
}

export interface BackendStackProps extends cdk.StackProps {
    imageTag: string;
    tableName: string;
    serviceName: string;
    repositoryName: string;
}
