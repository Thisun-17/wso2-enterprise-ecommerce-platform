import { productServiceClient } from './api';
import { 
  Product, 
  ApiResponse, 
  CreateProductData, 
  UpdateProductData,
  HealthResponse 
} from '../types';

/**
 * Fetch all products from the product service
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await productServiceClient.get<ApiResponse<Product[]>>('/products');
  return response.data;
};

/**
 * Fetch a single product by ID
 */
export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await productServiceClient.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data;
};

/**
 * Create a new product
 */
export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  const response = await productServiceClient.post<ApiResponse<Product>>('/products', productData);
  return response.data;
};

/**
 * Update an existing product
 */
export const updateProduct = async (id: number, productData: UpdateProductData): Promise<Product> => {
  const response = await productServiceClient.put<ApiResponse<Product>>(`/products/${id}`, productData);
  return response.data;
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: number): Promise<void> => {
  await productServiceClient.delete<ApiResponse<null>>(`/products/${id}`);
};

/**
 * Check product service health
 */
export const checkProductServiceHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await productServiceClient.get<HealthResponse>('/health');
    return response;
  } catch (error) {
    return {
      status: 'unhealthy',
      service: 'Product Service',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Product service API utility functions
 */
export const productApi = {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  checkHealth: checkProductServiceHealth,
} as const;
