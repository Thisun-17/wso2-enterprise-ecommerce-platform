import { useState, useEffect, useCallback } from 'react';
import { Product, CreateProductData, UpdateProductData, ApiError } from '../types';
import { productApi } from '../lib/products';

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
}

interface UseProductsActions {
  fetchProducts: () => Promise<void>;
  createProduct: (data: CreateProductData) => Promise<Product | null>;
  updateProduct: (id: number, data: UpdateProductData) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  clearError: () => void;
  refreshProducts: () => Promise<void>;
}

export const useProducts = (): UseProductsState & UseProductsActions => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await productApi.fetchProducts();
      setProducts(data);
      setTotal(data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: CreateProductData): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newProduct = await productApi.createProduct(data);
      setProducts(prev => [...prev, newProduct]);
      setTotal(prev => prev + 1);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: number, data: UpdateProductData): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProduct = await productApi.updateProduct(id, data);
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await productApi.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      setTotal(prev => prev - 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  // Auto-fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    total,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
    refreshProducts,
  };
};

// Hook for fetching a single product
interface UseSingleProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

interface UseSingleProductActions {
  fetchProduct: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useProduct = (): UseSingleProductState & UseSingleProductActions => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProduct = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await productApi.fetchProduct(id);
      setProduct(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    product,
    loading,
    error,
    fetchProduct,
    clearError,
  };
};
