import { catalogBatchProcess } from './handlers/catalog-batch-process';
import { createProduct } from './handlers/create-product';
import 'source-map-support/register';

import { getProductById } from './handlers/get-product-by-id';
import { getAllProducts } from './handlers/get-all-products';

export {
  getProductById,
  getAllProducts,
  createProduct,
  catalogBatchProcess
}
