#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CoreStack } from '../core/core-stack';
import { BackendStack } from '../backend/backend-stack';

const app = new cdk.App();
new CoreStack(app, 'CoreStack', {
  name: 'todo-backend',
  accountId: process.env.CDK_DEFAULT_ACCOUNT!!,
  region: process.env.CDK_DEFAULT_REGION!!,
});
new BackendStack(app, 'BackendStack', {
});