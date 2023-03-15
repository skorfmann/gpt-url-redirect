// create-short-url-lambda/index.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomBytes } from 'crypto';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

function generateShortUrl(): string {
  return randomBytes(4).toString('hex');
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const requestBody = event.body ? JSON.parse(event.body) : {};
  const { originalUrl } = requestBody;

  if (!originalUrl) {
    return { statusCode: 400, body: 'Missing originalUrl' };
  }

  const shortUrl = generateShortUrl();

  await dynamoDb.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { shortUrl, originalUrl },
  }));

  return { statusCode: 200, body: JSON.stringify({ shortUrl }) };
};
