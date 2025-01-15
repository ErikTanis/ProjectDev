import React, { createContext, useState, useCallback } from 'react';
import { authService, LoginCredentials, LoginResponse, RegisterCredentials, UserInfo } from '~services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
	register: (credentials: RegisterCredentials) => Promise<boolean>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  userInfo: UserInfo | null;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [error, setError] = useState<string | null>(null);
  // Initialize userInfo from localStorage
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update setUserInfo to also save to localStorage
  const updateUserInfo = useCallback((user: UserInfo | null) => {
    setUserInfo(user);
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, []);

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
      const user = await authService.getUserInfo(response.token);
      updateUserInfo(user); // Use the new updateUserInfo function
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    }
  }, [updateUserInfo]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await authService.logout(token);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); // Clear user info from localStorage
    setToken(null);
    updateUserInfo(null); // Clear user info from state
  }, [token, updateUserInfo]);


  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!token,
      token,
			register,
      login,
      logout,
      userInfo,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};
