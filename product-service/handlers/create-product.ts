import { ProductDTO, Product } from './../product.model';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultHeaders } from '../../default-headers';
import { Client } from 'pg';
import { StatusCodes } from 'http-status-codes';
import { dbConfig } from '../pg.config';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  const client = new Client(dbConfig);

  try {
    const product = JSON.parse(event.body) as ProductDTO;
    console.log('Product DTO: ', product);

    if (product && product.title && product.price) {
      return await createProductInDB(client, product);
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
  } finally {
    client.end();
  }
};

async function createProductInDB(client: Client, product: ProductDTO) {
  try {
    await client.connect();
    await client.query('BEGIN');
    const insertResult = await client.query<Product>(
      'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id',
      [product.title, product.description, product.price]
    );
    const insertedProductId = insertResult.rows?.[0]?.id;
    console.log('New product id:', insertedProductId);

    await client.query(
      'INSERT INTO stocks (product_id, count) VALUES ($1, $2)',
      [insertedProductId, +product.count]
    );
    await client.query('COMMIT');
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ message: 'Product created' }),
      headers: defaultHeaders
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }


}
