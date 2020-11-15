import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultHeaders } from '../default-headers';
import { StatusCodes } from 'http-status-codes';
import { Client } from 'pg';
import { Product } from '../product.model';
import { dbConfig } from '../pg.config';

export const getAllProducts: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  const client = new Client(dbConfig);

  try {
    await client.connect();
    const result = await client.query<Product>(
      `SELECT id, title, description, price, count FROM products p
      LEFT JOIN stocks s on p.id = s.product_id
      ORDER BY title`
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
    }
  } finally {
    client.end();
  }
};
