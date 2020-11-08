import { products } from '../products';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultHeaders } from '../default-headers';
import { StatusCodes } from 'http-status-codes';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  try {
    const { productId } = event.pathParameters;
    console.log('ID of requested product: ', productId);

    const product = products.find(p => p.id === +productId);
    if (product) {
      return {
        statusCode: StatusCodes.OK,
        body: JSON.stringify(product),
        headers: defaultHeaders
      };
    };

    return {
      statusCode: StatusCodes.NOT_FOUND,
      body: JSON.stringify({ message: 'Product not found' }),
      headers: defaultHeaders
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: error }),
      headers: defaultHeaders
    };
  }
};
