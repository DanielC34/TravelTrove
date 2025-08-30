import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleLearnMore = () => {
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Travel Trove
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your AI-powered travel planning companion
          </p>
          <div className="space-x-4">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <button
              onClick={handleLearnMore}
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
