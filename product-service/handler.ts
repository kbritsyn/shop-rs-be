require('source-map-support').install();

import { getProductById } from './handlers/get-product-by-id';
import { getAllProducts } from './handlers/get-all-products';
import { insertProducts } from './handlers/insert-products';
import { createProduct } from './handlers/create-product';
import { catalogBatchProcess } from './handlers/catalog-batch-process';

export {
  getProductById,
  getAllProducts,
  insertProducts,
  createProduct,
  catalogBatchProcess
}
