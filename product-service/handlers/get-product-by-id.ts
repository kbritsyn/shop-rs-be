import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { defaultHeaders } from '../default-headers';
import { tableName } from '../constants';

const dynamoClient = new DynamoDB.DocumentClient();

export const getProductById: APIGatewayProxyHandler = async (event) => {
    console.log('Lambda invocation with event: ', event);

    try {
        const { productId } = event.pathParameters!;
        console.log('ID of requested product: ', productId);

        const result = await dynamoClient.get({
            TableName: tableName,
            Key: { id: productId }
        }).promise();

        if (result && result.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(result.Item),
                headers: defaultHeaders
            };
        };

        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Product not found' }),
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
