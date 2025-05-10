import { create } from "zustand";
import { toast } from "sonner";
import { authApi } from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  initialize: () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      set({ user: JSON.parse(storedUser), isAuthenticated: true });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { token, user } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, isAuthenticated: true });
      toast.success("Successfully logged in!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    }
  },

  signup: async (fullName: string, email: string, password: string) => {
    try {
      const response = await authApi.register(fullName, email, password);
      const { token, user } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, isAuthenticated: true });
      toast.success("Account created successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast.error(message);
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("You have been logged out");
  }
}));
