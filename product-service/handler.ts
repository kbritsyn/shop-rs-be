require('source-map-support').install();

import { getProductById } from './handlers/get-product-by-id';
import { getAllProducts } from './handlers/get-all-products';
import { insertProducts } from './handlers/insert-products';

export {
  getProductById,
  getAllProducts,
  insertProducts
}
