import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultHeaders } from '../default-headers';
import { StatusCodes } from 'http-status-codes';
import { Client } from 'pg';
import { Product } from '../product.model';
import { dbConfig } from '../pg.config';

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  try {
    const client = new Client(dbConfig);
    await client.connect();
    const result = await client.query<Product>(
      `SELECT id, title, description, price, count FROM products p
      JOIN stocks s on p.id = s.product_id`
    );
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(result.rows),
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
