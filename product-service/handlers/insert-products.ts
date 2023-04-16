import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid'
import { tableName } from '../constants';
import { products } from '../database/products';

const dynamoClient = new DynamoDB.DocumentClient();

export const insertProducts = async () => {
    try {
        const putRequestObjects = products.map(product => ({
            PutRequest: {
                Item: {
                    id: uuid(),
                    count: product.count,
                    description: product.description,
                    price: product.price,
                    title: product.title,
                },
            },
        }));
    
        await dynamoClient.batchWrite({
            RequestItems: {
                [tableName]: putRequestObjects,
            },
        }).promise();
    
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Products have been saved' }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }

}
