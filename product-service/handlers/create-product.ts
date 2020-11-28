import { ProductDTO } from './../product.model';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultHeaders } from '../../default-headers';
import { StatusCodes } from 'http-status-codes';
import { insertProduct } from '../db/insert-product';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  try {
    const product = JSON.parse(event.body) as ProductDTO;
    console.log('Product DTO: ', product);

    if (product && product.title && product.price) {
      await insertProduct(product);
      return {
        statusCode: StatusCodes.OK,
        body: JSON.stringify({ message: 'Product created' }),
        headers: defaultHeaders
      };
    } else {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({ message: 'Invalid product' }),
        headers: defaultHeaders
      };
    }
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: error }),
      headers: defaultHeaders
    };
  }
};

