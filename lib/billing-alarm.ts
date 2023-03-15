// BillingAlarmConstruct.ts
import { Construct } from 'constructs';
import { Alarm, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Duration } from 'aws-cdk-lib';

export interface BillingAlarmConstructProps {
  billingThreshold: number;
  emailAddress: string;
}

export class BillingAlarmConstruct extends Construct {
  constructor(scope: Construct, id: string, props: BillingAlarmConstructProps) {
    super(scope, id);

    const { billingThreshold, emailAddress } = props;

    // Create an SNS topic for billing alarm notifications
    const billingAlarmTopic = new Topic(this, 'BillingAlarmTopic', {
      displayName: 'Billing Alarm Topic',
    });

    // Subscribe the provided email address to the SNS topic
    billingAlarmTopic.addSubscription(
      new subscriptions.EmailSubscription(emailAddress)
    );

    // Create a billing alarm
    const alarm = new Alarm(this, 'BillingAlarm', {
      metric: new Metric({
        namespace: 'AWS/Billing',
        metricName: 'EstimatedCharges',
        dimensionsMap: {
          Currency: 'USD',
        },
        period: Duration.hours(6),
      }),
      threshold: billingThreshold,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: `AWS account is nearing the billing threshold of $${billingThreshold}`,
    });

    // Add the SNS topic as an action for the billing alarm
    alarm.addAlarmAction(new SnsAction(billingAlarmTopic));
  }
}
