import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaEye,
} from "react-icons/fa";

const Trips = () => {
  const trips = [
    {
      id: "1",
      name: "Paris Adventure",
      destination: "Paris, France",
      startDate: "2024-03-15",
      endDate: "2024-03-22",
      status: "confirmed",
      budget: 2500,
      travelers: 2,
      image:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400",
    },
    {
      id: "2",
      name: "Tokyo Exploration",
      destination: "Tokyo, Japan",
      startDate: "2024-04-10",
      endDate: "2024-04-17",
      status: "planning",
      budget: 3200,
      travelers: 1,
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
              <p className="text-gray-600 mt-2">
                Manage and organize your travel adventures
              </p>
            </div>
            <Link
              to="/trips/new"
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <FaPlus />
              <span>Create New Trip</span>
            </Link>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={trip.image}
                  alt={trip.destination}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      trip.status
                    )}`}
                  >
                    {trip.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {trip.name}
                </h3>
                <p className="text-gray-600 flex items-center space-x-1 mb-3">
                  <FaMapMarkedAlt className="text-blue-600" />
                  <span>{trip.destination}</span>
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaCalendarAlt className="text-blue-600" />
                      <span>
                        {formatDate(trip.startDate)} -{" "}
                        {formatDate(trip.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaUsers className="text-green-600" />
                      <span>
                        {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaDollarSign className="text-yellow-600" />
                      <span>${trip.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/trips/${trip.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <FaEye />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trips;
