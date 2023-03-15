// redirect-short-url-lambda/index.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandler = async (event) => {
  const pathParameters = event.pathParameters || {};
  const shortUrl = pathParameters.shortUrl;

  if (!shortUrl) {
    return { statusCode: 400, body: 'Missing shortUrl' };
  }

  const result = await dynamoDb.send(new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: { shortUrl },
  }));

  if (result.Item) {
    return {
      statusCode: 302,
      headers: { Location: result.Item.originalUrl },
      body: '',
    };
  } else {
    return { statusCode: 404, body: 'URL not found' };
  }
};
