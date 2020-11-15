export interface ProductDTO {
  title: string;
  description: string;
  price: number;
  count: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface ProductCount {
  id: string;
  count: number;
}

export type ProductWithCount = Product & ProductCount;
