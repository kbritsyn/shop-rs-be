import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid'
import { tableName } from '../constants';
import { Product } from '../database/product.model';
import { defaultHeaders } from '../../default-headers';

const dynamoClient = new DynamoDB.DocumentClient();

export const createProduct: APIGatewayProxyHandler = async ({ body }) => {
    try {
        console.log(body);

        const requestObject: Product | null = body ? JSON.parse(body) : null;

        if (!requestObject || !requestObject.title || !requestObject.price || !requestObject.count) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid product' }),
            };
        }
        const newProduct: Product = {
            ...requestObject,
            id: uuid()
        }
    
        await dynamoClient.put({
            TableName: tableName,
            Item: newProduct
        }).promise();
    
        return {
            statusCode: 200,
            body: JSON.stringify(newProduct),
            headers: defaultHeaders
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }

}


