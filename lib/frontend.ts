import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { CfnOutput } from "aws-cdk-lib";
import {
  CloudFrontWebDistribution,
  OriginProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for the static website
    const websiteBucket = new Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      encryption: BucketEncryption.S3_MANAGED,
    });

    // Deploy the React build files to the S3 bucket
    new BucketDeployment(this, "DeployWebsite", {
      sources: [Source.asset("./url-shortener-frontend/build")], // Adjust the path to your React build folder
      destinationBucket: websiteBucket,
    });

    const distribution = new CloudFrontWebDistribution(this, "WebsiteDistribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          responsePagePath: "/index.html",
          responseCode: 200,
        },
      ],
    });

    new CfnOutput(this, "WebsiteUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "The URL of the deployed static website",
    });
  }
}
