import { APIGatewayProxyHandler } from 'aws-lambda';
import { products } from '../products';
import { defaultHeaders } from '../default-headers';

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(products),
      headers: defaultHeaders
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
      headers: defaultHeaders
    };
  }
};
