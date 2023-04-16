import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { tableName } from '../constants';
import { defaultHeaders } from '../default-headers';

const dynamoClient = new DynamoDB.DocumentClient();

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
    console.log('Lambda invocation with event: ', event);

    try {
        const result = await dynamoClient.scan({
            TableName: tableName
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
            headers: defaultHeaders
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
            headers: defaultHeaders
        };
    }
};
