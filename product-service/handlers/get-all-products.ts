import { APIGatewayProxyHandler } from 'aws-lambda';
import { products } from '../products';

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};
