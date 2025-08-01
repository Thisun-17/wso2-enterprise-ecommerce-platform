import { ApiError } from '../types';

// Service URLs
export const API_CONFIG = {
  PRODUCT_SERVICE: 'http://localhost:3001',
  USER_SERVICE: 'http://localhost:3002',
  TIMEOUT: 10000, // 10 seconds
} as const;

// Custom error class for API errors
export class ApiErrorClass extends Error implements ApiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Generic HTTP client with error handling
export class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = API_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }

        throw new ApiErrorClass(errorMessage, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiErrorClass) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiErrorClass('Request timeout', 408, 'TIMEOUT');
        }
        
        if (error.message.includes('Failed to fetch')) {
          throw new ApiErrorClass(
            'Service unavailable. Please check if the backend is running.',
            503,
            'SERVICE_UNAVAILABLE'
          );
        }

        throw new ApiErrorClass(error.message, 500, 'UNKNOWN_ERROR');
      }

      throw new ApiErrorClass('An unexpected error occurred', 500);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create HTTP clients for each service
export const productServiceClient = new HttpClient(API_CONFIG.PRODUCT_SERVICE);
export const userServiceClient = new HttpClient(API_CONFIG.USER_SERVICE);

// Health check utility
export const checkServiceHealth = async (serviceUrl: string): Promise<boolean> => {
  try {
    const client = new HttpClient(serviceUrl);
    await client.get('/health');
    return true;
  } catch {
    return false;
  }
};

// Check all services health
export const checkAllServicesHealth = async () => {
  const [productServiceHealthy, userServiceHealthy] = await Promise.all([
    checkServiceHealth(API_CONFIG.PRODUCT_SERVICE),
    checkServiceHealth(API_CONFIG.USER_SERVICE),
  ]);

  return {
    productService: productServiceHealthy,
    userService: userServiceHealthy,
    allHealthy: productServiceHealthy && userServiceHealthy,
  };
};
