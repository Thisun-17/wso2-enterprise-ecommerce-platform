// Base API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

// Product interface matching your backend response
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

// User interface matching your backend response
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  isActive: boolean;
}

// Authentication types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token?: string;
  };
  message?: string;
}

// Form data types for creating/updating
export interface CreateProductData {
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

export type UpdateProductData = Partial<CreateProductData>;

export interface CreateUserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: 'customer' | 'admin';
}

export type UpdateUserData = Partial<Omit<CreateUserData, 'password'>>;

// API Error type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Health check response
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  service: string;
  timestamp: string;
}
