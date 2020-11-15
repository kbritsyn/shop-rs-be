import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultHeaders } from '../default-headers';
import { StatusCodes } from 'http-status-codes';
import { Client } from 'pg';
import { dbConfig } from '../pg.config';
import { Product } from '../product.model';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  const client = new Client(dbConfig);

  try {
    const { productId } = event.pathParameters;
    console.log('ID of requested product: ', productId);

    await client.connect();
    const result = await client.query<Product>(
      `SELECT id, title, description, price, count FROM products p
      LEFT JOIN stocks s on p.id = s.product_id
      WHERE id=$1`,
      [productId]
    );
    if (result.rowCount) {
      return {
        statusCode: StatusCodes.OK,
        body: JSON.stringify(result.rows[0]),
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
  } finally {
    client.end();
  }
};
