import { defaultHeaders } from './../../default-headers';
import { StatusCodes } from 'http-status-codes';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { BUCKET_NAME, REGION } from '../constants';


export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  try {
    const s3 = new S3({ region: REGION, signatureVersion: 'v4' });

    const fileName = event.queryStringParameters.name;
    const signedUrlParams = {
      Bucket: BUCKET_NAME,
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: 'text/csv'
    }

    const signedUrl = await s3.getSignedUrlPromise('putObject', signedUrlParams);

    return {
      statusCode: StatusCodes.OK,
      headers: defaultHeaders,
      body: JSON.stringify(signedUrl)
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: defaultHeaders,
      body: JSON.stringify({ message: error })
    }
  }
} 