## Seed

You are an AI programming assistant.

- Follow the user's requirements carefully & to the letter.
- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
- Then output the code in a single code block.
- Minimize any other prose


## Prompts


1. I want to build the backend for an URL shortener with the AWS CDK in Typescript. I'll need:
    - A RestAPI with two endpoints:
        - Create Short URL
        - Redirect for Short URL
    - The urls should be persisted in DynamoDB

2. Great - now create both lambda handlers

3. Please use the aws sdk v3 and proper types

4. Two errors for the create handler:
    1. Cannot find name 'DynamoDBClient'.ts(2304)
    2. `const { originalUrl } = JSON.parse(event.body);` Argument of type 'string | null' is not assignable to parameter of type 'string'. Type 'null' is not assignable to type 'string'.ts(2345)

5. Module '"@aws-sdk/client-dynamodb"' has no exported member 'PutCommand'.ts(2305)
   Module '"@aws-sdk/client-dynamodb"' has no exported member 'DynamoDBDocumentClient'.ts(2305)

6. Property 'send' does not exist on type 'DynamoDBDocumentClient'.ts(2339)

7. (alias) new DynamoDBDocumentClient(client: DynamoDBClient, translateConfig?: TranslateConfig | undefined): DynamoDBDocumentClient
   import DynamoDBDocumentClient
   Constructor of class 'DynamoDBDocumentClient' is protected and only accessible within the class declaration.ts(2674)

8. Ok, great that works. And now fix the redirect handler accordingly

9. (property) APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>.pathParameters: APIGatewayProxyEventPathParameters | null
   'event.pathParameters' is possibly 'null'.ts(18047)

10. Great - and now use the NodejsFunction construct in the cdk stack

11. Use the id as entry

12. We'll need to reference the full path as the entry

13. Please generate a Readme for the application

14. The code blocks are messed up, please fix the readme

15. Please provide curl examples

16. And now build the same stack, but with "CDK for Terraform" (cdktf)

17. Instead of the generated provider use the prebuilt provider "@cdktf/provider-aws"

18. How would a similar app look like in Azure built with Terraform?

19. Please adjust the handler code to work in Azure Functions

20. Back to the original CDK stack. Please write a new construct which monitors the amount of API and Lambda invocations

21. Module '"aws-cdk-lib/aws-lambda"' has no exported member 'LambdaFunction'.ts(2305)

22. In the monitoring construct: Argument of type '{ namespace: string; metricName: string; dimensions: { ApiName: string; }; period: any; }' is not assignable to parameter of type 'MetricProps'. Object literal may only specify known properties, but 'dimensions' does not exist in type 'MetricProps'. Did you mean to write 'dimensionsMap'?ts(2345)
