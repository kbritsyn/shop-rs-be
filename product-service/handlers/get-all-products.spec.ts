import { getAllProducts } from './get-all-products';
import { products } from '../products';

describe('getAllProducts', () => {
  it('should return response with code 200 and all products', async () => {
    const result = await getAllProducts({} as any, null, null);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(products),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  });
});
