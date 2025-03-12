import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CoreStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: CoreStackProps) {
        super(scope, id, props);

        const repo = new ecr.Repository(this, 'TodosEcr', {
            repositoryName: props.name,
            imageScanOnPush: true,
            lifecycleRules: [
                {
                    maxImageCount: 1,
                },
            ]
        });

        repo.grantPull(new iam.AccountPrincipal(props.env?.account));
    }
}

export interface CoreStackProps extends cdk.StackProps {
    name: string;
}
