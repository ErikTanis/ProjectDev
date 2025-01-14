import React, { createContext, useState, useCallback } from 'react';
import { authService, LoginCredentials, LoginResponse, RegisterCredentials } from '~services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
	register: (credentials: RegisterCredentials) => Promise<boolean>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [error, setError] = useState<string | null>(null);

	const register = useCallback(async (credentials: RegisterCredentials) => {
		try {
			await authService.register(credentials);
			setError(null);
			return true;
		} catch (err: any) {
			setError(err.message || 'Registration failed');
			return false;
		}
	}, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await authService.logout(token);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    localStorage.removeItem('token');
    setToken(null);
  }, [token]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!token,
      token,
			register,
      login,
      logout,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};
