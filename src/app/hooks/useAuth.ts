import { useState, useEffect } from "react";
import { authApi } from "../services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "customer" | "delivery-agent";
  isLoggedIn: boolean;
}

const AUTH_STORAGE_KEY = "grocery-auth-user";
const TOKEN_STORAGE_KEY = "auth-token";

const DEFAULT_USER: User = {
  id: "",
  name: "",
  email: "",
  mobile: "",
  role: "customer",
  isLoggedIn: false,
};

export function useAuth() {
  const [user, setUserState] = useState<User>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount and verify token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        
        if (token) {
          // Try to fetch current user from API
          try {
            const currentUser = await authApi.getCurrentUser();
            const userData: User = {
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              mobile: currentUser.mobile,
              isLoggedIn: true,
            };
            setUserState(userData);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
          } catch (err) {
            // Token might be invalid, clear it
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setUserState(DEFAULT_USER);
          }
        } else {
          // No token, try to load from localStorage (for offline support)
          const stored = localStorage.getItem(AUTH_STORAGE_KEY);
          if (stored) {
            const parsedUser = JSON.parse(stored);
            // Ensure role is set (default to customer for backward compatibility)
            if (!parsedUser.role) {
              parsedUser.role = "customer";
            }
            setUserState(parsedUser);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setError("Failed to load authentication");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    mobile: string,
    name: string,
    role: "customer" | "delivery-agent" = "customer",
    password: string = "default"
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call API login
      const response: any = await authApi.login({
        email: email || undefined,
        mobile: mobile || undefined,
        password,
      });

      // Store token
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);

      // Create user object
      const newUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        mobile: response.user.mobile,
        role: role,
        isLoggedIn: true,
      };

      setUserState(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      
      return newUser;
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    mobile: string,
    name: string,
    role: "customer" | "delivery-agent" = "customer",
    password: string,
    passwordConfirm: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: any = await authApi.login({
        email: email || undefined,
        mobile: mobile || undefined,
        password,
      });

      // Store token
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);

      // Create user object
      const newUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        mobile: response.user.mobile,
        role: role,
        isLoggedIn: true,
      };

      setUserState(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

      return newUser;
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Clear local data
      setUserState(DEFAULT_USER);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Update local state
      const updated: User = {
        ...user,
        ...updatedData,
      };

      setUserState(updated);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

      return updated;
    } catch (err: any) {
      const errorMessage = err.message || "Profile update failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
  };
}
