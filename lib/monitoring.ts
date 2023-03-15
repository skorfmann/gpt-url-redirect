// MonitoringConstruct.ts
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Alarm, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch';

export interface MonitoringConstructProps {
  api: RestApi;
  createShortUrlLambda: Function;
  redirectShortUrlLambda: Function;
  apiInvocationThreshold: number;
  lambdaInvocationThreshold: number;
  evaluationPeriods: number;
}

export class MonitoringConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MonitoringConstructProps) {
    super(scope, id);

    const { api, createShortUrlLambda, redirectShortUrlLambda, apiInvocationThreshold, lambdaInvocationThreshold, evaluationPeriods } = props;

    // Monitor API invocations
    new Alarm(this, 'ApiInvocationAlarm', {
      metric: new Metric({
        namespace: 'AWS/ApiGateway',
        metricName: 'Count',
        dimensionsMap: { // Corrected property name
          ApiName: api.restApiId,
        },
        period: cdk.Duration.minutes(1),
      }),
      threshold: apiInvocationThreshold,
      evaluationPeriods: evaluationPeriods,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });

    // Monitor CreateShortUrl Lambda invocations
    new Alarm(this, 'CreateShortUrlLambdaInvocationAlarm', {
      metric: createShortUrlLambda.metric('Invocations', { period: cdk.Duration.minutes(1), }),
      threshold: lambdaInvocationThreshold,
      evaluationPeriods: evaluationPeriods,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });

    // Monitor RedirectShortUrl Lambda invocations
    new Alarm(this, 'RedirectShortUrlLambdaInvocationAlarm', {
      metric: redirectShortUrlLambda.metric('Invocations', { period: cdk.Duration.minutes(1), }),
      threshold: lambdaInvocationThreshold,
      evaluationPeriods: evaluationPeriods,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
  }
}
