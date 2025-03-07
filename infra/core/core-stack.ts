import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CoreStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: CoreStackProps) {
        super(scope, id, { ...props, env: { account: props.accountId, region: props.region } });

        const repo = new ecr.Repository(this, props.name, {
            repositoryName: props.name,
            imageScanOnPush: true,
        });
        repo.grantPull(new iam.AccountPrincipal(props.accountId));
    }
}

export interface CoreStackProps extends cdk.StackProps {
    name: string;
    accountId: string;
    region: string;
}
