import { useState, useEffect, useCallback } from 'react';
import { HealthResponse } from '../types';
import { checkAllServicesHealth, productServiceClient, userServiceClient } from '../lib/api';
import { productApi } from '../lib/products';
import { userApi } from '../lib/users';

interface ServiceHealth {
  productService: {
    healthy: boolean;
    details?: HealthResponse;
    lastChecked: string;
  };
  userService: {
    healthy: boolean;
    details?: HealthResponse;
    lastChecked: string;
  };
  allHealthy: boolean;
}

interface UseHealthState {
  health: ServiceHealth;
  loading: boolean;
  error: string | null;
}

interface UseHealthActions {
  checkHealth: () => Promise<void>;
  checkServiceHealth: (service: 'product' | 'user') => Promise<void>;
  clearError: () => void;
  startAutoCheck: (intervalMs?: number) => void;
  stopAutoCheck: () => void;
}

export const useHealth = (autoCheckInterval?: number): UseHealthState & UseHealthActions => {
  const [health, setHealth] = useState<ServiceHealth>({
    productService: {
      healthy: false,
      lastChecked: new Date().toISOString(),
    },
    userService: {
      healthy: false,
      lastChecked: new Date().toISOString(),
    },
    allHealthy: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkServiceHealth = useCallback(async (service: 'product' | 'user') => {
    setLoading(true);
    setError(null);
    
    try {
      const timestamp = new Date().toISOString();
      
      if (service === 'product') {
        const details = await productApi.checkHealth();
        setHealth(prev => ({
          ...prev,
          productService: {
            healthy: details.status === 'healthy',
            details,
            lastChecked: timestamp,
          },
          allHealthy: details.status === 'healthy' && prev.userService.healthy,
        }));
      } else {
        const details = await userApi.checkHealth();
        setHealth(prev => ({
          ...prev,
          userService: {
            healthy: details.status === 'healthy',
            details,
            lastChecked: timestamp,
          },
          allHealthy: prev.productService.healthy && details.status === 'healthy',
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to check ${service} service health`;
      setError(errorMessage);
      
      const timestamp = new Date().toISOString();
      setHealth(prev => ({
        ...prev,
        [service === 'product' ? 'productService' : 'userService']: {
          healthy: false,
          lastChecked: timestamp,
        },
        allHealthy: false,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const timestamp = new Date().toISOString();
      
      // Check both services in parallel
      const [productHealth, userHealth] = await Promise.allSettled([
        productApi.checkHealth(),
        userApi.checkHealth(),
      ]);

      const productHealthy = productHealth.status === 'fulfilled' && 
                            productHealth.value.status === 'healthy';
      const userHealthy = userHealth.status === 'fulfilled' && 
                         userHealth.value.status === 'healthy';

      setHealth({
        productService: {
          healthy: productHealthy,
          details: productHealth.status === 'fulfilled' ? productHealth.value : undefined,
          lastChecked: timestamp,
        },
        userService: {
          healthy: userHealthy,
          details: userHealth.status === 'fulfilled' ? userHealth.value : undefined,
          lastChecked: timestamp,
        },
        allHealthy: productHealthy && userHealthy,
      });

      // Set error if any service check was rejected
      if (productHealth.status === 'rejected' || userHealth.status === 'rejected') {
        const errors = [];
        if (productHealth.status === 'rejected') {
          errors.push(`Product service: ${productHealth.reason}`);
        }
        if (userHealth.status === 'rejected') {
          errors.push(`User service: ${userHealth.reason}`);
        }
        setError(errors.join(', '));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check services health';
      setError(errorMessage);
      
      const timestamp = new Date().toISOString();
      setHealth({
        productService: {
          healthy: false,
          lastChecked: timestamp,
        },
        userService: {
          healthy: false,
          lastChecked: timestamp,
        },
        allHealthy: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const startAutoCheck = useCallback((interval = 30000) => {
    // Stop existing interval if any
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    // Start new interval
    const newIntervalId = setInterval(() => {
      checkHealth();
    }, interval);
    
    setIntervalId(newIntervalId);
  }, [checkHealth, intervalId]);

  const stopAutoCheck = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  // Initial health check on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Auto-start checking if interval is provided
  useEffect(() => {
    if (autoCheckInterval) {
      startAutoCheck(autoCheckInterval);
    }
    
    return () => {
      stopAutoCheck();
    };
  }, [autoCheckInterval, startAutoCheck, stopAutoCheck]);

  return {
    health,
    loading,
    error,
    checkHealth,
    checkServiceHealth,
    clearError,
    startAutoCheck,
    stopAutoCheck,
  };
};
