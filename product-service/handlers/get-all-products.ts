import { APIGatewayProxyHandler } from 'aws-lambda';
import { products } from '../products';
import { defaultHeaders } from '../default-headers';
import { StatusCodes } from 'http-status-codes';

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  try {
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(products),
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
