import { useContext } from "react";
import { AuthContext } from "~contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const register = async (userData: any) => {
    try {
      // Log the request
      console.log("Registration request:", {
        url: "/api/v1/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userData,
      });

      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Log the raw response
      console.log("Raw response:", response);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        const errorMessage = Array.isArray(data)
          ? data.join(", ")
          : typeof data === "string"
          ? data
          : data.message || "Registration failed";
        throw new Error(errorMessage);
      }

      return true;
    } catch (error: any) {
      console.error("Registration error:", {
        message: error.message,
        error,
      });
      throw error;
    }
  };

  return {
    ...context,
    register,
  };
};
