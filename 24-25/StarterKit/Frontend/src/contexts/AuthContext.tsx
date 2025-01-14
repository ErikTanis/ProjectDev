import React, { createContext, useState, useCallback } from "react";
import {
  authService,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
} from "~services/authService";

interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
  updateUser?: (userData: Partial<User>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      await authService.register(credentials);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      return false;
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      localStorage.setItem("token", response.token);

      // Create user object from login response
      const userData: User = {
        username: credentials.username,
        email: response.email || "",
        firstName: response.firstName || "",
        lastName: response.lastName || "",
        roles: response.roles || [],
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Login failed");
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await authService.logout(token);
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, [token]);

  const updateUser = useCallback(
    async (userData: Partial<User>) => {
      try {
        if (!user) return false;

        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to update user");
        return false;
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        user,
        register,
        login,
        logout,
        error,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
