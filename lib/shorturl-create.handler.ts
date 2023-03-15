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

  try {
    new URL(originalUrl);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Invalid URL' }),
    };
  }

  const shortUrl = generateShortUrl();

  const domainName = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const basePath = event.resource.split('/').slice(0, -1).join('/');
  const fullShortUrl = `https://${domainName}/${stage}${basePath}/${shortUrl}`;

  await dynamoDb.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { shortUrl, originalUrl },
  }));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ shortUrl: fullShortUrl, shortCode: shortUrl }),
  };
};
