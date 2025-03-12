#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CoreStack } from '../core/core-stack';
import { BackendStack } from '../backend/backend-stack';
import { FrontendStack } from '../frontend/frontend-stack';

const app = new cdk.App();

new CoreStack(app, 'CoreStack', {
  name: process.env.CDK_ECR_REPO_NAME!!,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT!!,
    region: process.env.CDK_DEFAULT_REGION!!,
  },
});

new BackendStack(app, 'BackendStack', {
  tableName: process.env.CDK_DYNAMODB_TABLE_NAME!!,
  serviceName: process.env.CDK_SERVICE_NAME!!,
  repositoryName: process.env.CDK_ECR_REPO_NAME!!,
  imageTag: process.env.CDK_ECR_IMAGE_TAG!!,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT!!,
    region: process.env.CDK_DEFAULT_REGION!!,
  },
});

new FrontendStack(app, 'FrontendStack');