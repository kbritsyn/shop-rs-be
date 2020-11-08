import { ProductDTO } from './../product.model';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { defaultHeaders } from '../default-headers';
import { Client } from 'pg';
import { StatusCodes } from 'http-status-codes';
import { dbConfig } from '../pg.config';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event: ', event);

  try {
    const product = JSON.parse(event.body) as ProductDTO;
    console.log('Product DTO: ', product);

    if (product && product.title && product.price) {
      return await createProductInDB(product);
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

async function createProductInDB(product: ProductDTO) {
  const client = new Client(dbConfig);
  await client.connect();
  await client.query(
    'INSERT INTO products (title, description, price) VALUES ($1, $2, $3)',
    [product.title, product.description, product.price]
  );
  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({ message: 'Product created' }),
    headers: defaultHeaders
  };
}
