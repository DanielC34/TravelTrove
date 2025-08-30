import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  FaPlane,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FaPlane className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TravelTrove
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/trips"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/trips")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <span>My Trips</span>
            </Link>
            <Link
              to="/explore"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/explore")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <span>Explore</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <FaSearch className="text-lg" />
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                  <FaBell className="text-lg" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Sign Out"
                  >
                    <FaSignOutAlt className="text-lg" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/trips"
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive("/trips")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link
                to="/explore"
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive("/explore")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>

              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
