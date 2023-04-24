import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid'
import { Product } from './product.model';
import { PRODUCTS_TABLE_NAME } from '../constants';

const dynamoClient = new DynamoDB.DocumentClient(); 

export const insertProduct = async (product: Product) => {
    return dynamoClient.put({
        TableName: PRODUCTS_TABLE_NAME,
        Item:  {
            ...product,
            id: uuid()
        }
    }).promise();
}
