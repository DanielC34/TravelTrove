import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: () => {
        // Check if user is already logged in from localStorage
        const token = localStorage.getItem("token");
        if (token) {
          // You could validate the token here
          set({ token, isAuthenticated: true });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store token in localStorage
          localStorage.setItem("token", data.token);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Login failed",
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch(
            "http://localhost:3001/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email, password }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Registration failed");
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store token in localStorage
          localStorage.setItem("token", data.token);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Registration failed",
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        localStorage.removeItem("token");
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
