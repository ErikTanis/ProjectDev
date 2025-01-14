import axios from "axios";

const API_URL = "/api/v1/auth";

export interface LoginResponse {
  token: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  register: async (credentials: RegisterCredentials): Promise<void> => {
    try {
      await axios.post(`${API_URL}/register`, credentials);
    } catch (error: any) {
      const errorMessage = error.response?.data?.title || "Registration failed";
      throw new Error(errorMessage);
    }
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.title || "Login failed";
      throw new Error(errorMessage);
    }
  },

  logout: async (token: string): Promise<void> => {
    await axios.post(`${API_URL}/revoke`, { token });
  },

  checkAdmin: async (token: string): Promise<{ isAdmin: boolean }> => {
    try {
      const response = await axios.get(`${API_URL}/is-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { isAdmin: response.status === 200 };
    } catch (error) {
      throw new Error("Failed to check admin status");
    }
  },
};
