import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlane,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaHeart,
  FaSearch,
  FaPlus,
  FaClock,
  FaStar,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
import { useAuthStore } from "@/stores/useAuthStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Ready for your next adventure? Let's plan something amazing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/trips"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              >
                <FaPlus />
                <span>Create New Trip</span>
              </Link>
              <Link
                to="/explore"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FaSearch />
                <span>Explore Destinations</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaPlane className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCalendarAlt className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaClock className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">$15,600</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaDollarSign className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/trips"
              className="flex items-center space-x-4 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FaPlus className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create New Trip</h3>
                <p className="text-sm text-gray-600">
                  Plan your next adventure
                </p>
              </div>
            </Link>

            <Link
              to="/explore"
              className="flex items-center space-x-4 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-colors group"
            >
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <FaSearch className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Explore Destinations
                </h3>
                <p className="text-sm text-gray-600">Discover amazing places</p>
              </div>
            </Link>

            <Link
              to="/trips"
              className="flex items-center space-x-4 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-colors group"
            >
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FaMapMarkedAlt className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View All Trips</h3>
                <p className="text-sm text-gray-600">Manage your adventures</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
