import { APIGatewayProxyHandler } from 'aws-lambda';
import { Product } from '../database/product.model';
import { defaultHeaders } from '../../default-headers';
import { insertProduct } from '../database/insert-product';

export const createProduct: APIGatewayProxyHandler = async ({body}) => {
    try {
        console.log(body);

        const newProduct: Product | null = body ? JSON.parse(body) : null;

        if (!newProduct || !newProduct.title || !newProduct.price || !newProduct.count) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid product' }),
            };
        }
    
        await insertProduct(newProduct);
    
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


