import { useState, useEffect, useCallback } from 'react';
import { User, CreateUserData, UpdateUserData, LoginCredentials, AuthResponse } from '../types';
import { userApi } from '../lib/users';

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
}

interface UseUsersActions {
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserData) => Promise<User | null>;
  updateUser: (id: number, data: UpdateUserData) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
  clearError: () => void;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (): UseUsersState & UseUsersActions => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userApi.fetchUsers();
      setUsers(data);
      setTotal(data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: CreateUserData): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await userApi.createUser(data);
      setUsers(prev => [...prev, newUser]);
      setTotal(prev => prev + 1);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: number, data: UpdateUserData): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userApi.updateUser(id, data);
      setUsers(prev => 
        prev.map(user => 
          user.id === id ? updatedUser : user
        )
      );
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await userApi.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      setTotal(prev => prev - 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Auto-fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    total,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    refreshUsers,
  };
};

// Hook for fetching a single user
interface UseSingleUserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UseSingleUserActions {
  fetchUser: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useUser = (): UseSingleUserState & UseSingleUserActions => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userApi.fetchUser(id);
      setUser(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    fetchUser,
    clearError,
  };
};

// Hook for authentication
interface UseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface UseAuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = (): UseAuthState & UseAuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userApi.authenticateUser(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        // Store token if provided
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        return true;
      } else {
        setError(response.message || 'Authentication failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authToken');
  }, []);

  const isAuthenticated = user !== null;

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
  };
};
