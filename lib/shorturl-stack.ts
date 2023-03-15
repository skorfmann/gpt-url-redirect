// lib/url-shortener-stack.ts
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { MonitoringConstruct } from './monitoring';
import { BillingAlarmConstruct } from './billing-alarm';

export class UrlShortenerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'UrlsTable', {
      partitionKey: { name: 'shortUrl', type: AttributeType.STRING },
    });

    const createShortUrlLambda = new NodejsFunction(this, 'CreateShortUrlLambda', {
      entry: path.join(__dirname, 'shorturl-create.handler.ts'),
      environment: { TABLE_NAME: table.tableName },
    });

    const redirectShortUrlLambda = new NodejsFunction(this, 'RedirectShortUrlLambda', {
      entry: path.join(__dirname, 'shorturl-redirect.handler.ts'),
      environment: { TABLE_NAME: table.tableName },
    });

    table.grantReadWriteData(createShortUrlLambda);
    table.grantReadWriteData(redirectShortUrlLambda);

    const api = new RestApi(this, 'UrlShortenerApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['Content-Type'],
      },
    });
    const createShortUrlResource = api.root.addResource('create');
    const redirectShortUrlResource = api.root.addResource('{shortUrl}');

    createShortUrlResource.addMethod('POST', new LambdaIntegration(createShortUrlLambda));
    redirectShortUrlResource.addMethod('GET', new LambdaIntegration(redirectShortUrlLambda));

    new MonitoringConstruct(this, 'Monitoring', {
      api: api,
      createShortUrlLambda: createShortUrlLambda,
      redirectShortUrlLambda: redirectShortUrlLambda,
      apiInvocationThreshold: 10,
      lambdaInvocationThreshold: 20,
      evaluationPeriods: 1,
    });

    new BillingAlarmConstruct(this, 'BillingAlarm', {
      billingThreshold: 10, // Set the desired billing threshold in USD
      emailAddress: 'sebastian@korfmann.net', // Set the desired email address for notifications
    });
  }
}
