import { defaultHeaders } from './../../default-headers';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { BUCKET_NAME, REGION } from '../constants';


export const importProductsFile: APIGatewayProxyHandler = async (event) => {
    console.log('Lambda invocation with event: ', event);

    try {
        const s3 = new S3({ region: REGION, signatureVersion: 'v4' });

        const fileName = event.queryStringParameters?.name;

        if (!fileName) {
            return {
                statusCode: 400,
                headers: defaultHeaders,
                body: JSON.stringify({ message: 'Invalid file name' })
            }
        }
        const signedUrlParams = {
            Bucket: BUCKET_NAME,
            Key: `uploaded/${fileName}`,
            Expires: 60,
            ContentType: 'text/csv'
        }

        const signedUrl = await s3.getSignedUrlPromise('putObject', signedUrlParams);

        return {
            statusCode: 200,
            headers: defaultHeaders,
            body: JSON.stringify(signedUrl)
        };
    } catch (error) {
        console.log(error);

        return {
            statusCode: 500,
            headers: defaultHeaders,
            body: JSON.stringify({ message: 'Internal Sever Error' })
        }
    }
} 