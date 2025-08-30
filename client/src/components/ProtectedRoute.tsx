import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-8">
            Please log in to access this page.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/auth")}
              className="bg-turquoise-600 text-white px-6 py-3 rounded-lg hover:bg-turquoise-700 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-turquoise-600 text-turquoise-600 px-6 py-3 rounded-lg hover:bg-turquoise-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
