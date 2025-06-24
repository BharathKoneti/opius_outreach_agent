#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ConsoleStack } from '../lib/console-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-west-2',
};

new ConsoleStack(app, 'OpiusConsoleStack', {
  env,
  description: 'Opius AI Enterprise Console - console.opiusai.com',
});