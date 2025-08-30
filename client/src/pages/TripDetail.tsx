import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaShare,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaUsers,
  FaDollarSign,
  FaPlus,
} from "react-icons/fa";

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const trip = {
    id: "1",
    name: "Paris Adventure",
    destination: "Paris, France",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    status: "confirmed",
    budget: 2500,
    travelers: 2,
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400",
    description:
      "Exploring the City of Light with romantic walks along the Seine and visits to iconic landmarks.",
  };

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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePlanActivities = () => {
    navigate("/trips/new");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/trips"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {trip.name}
                </h1>
                <p className="text-gray-600">{trip.destination}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <FaShare />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <FaEdit />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <img
                src={trip.image}
                alt={trip.destination}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      trip.status
                    )}`}
                  >
                    {trip.status}
                  </span>
                  <span className="text-sm text-gray-500">Trip #{trip.id}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dates</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(trip.startDate)} -{" "}
                        {formatDate(trip.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaMapMarkedAlt className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Destination
                      </p>
                      <p className="text-sm text-gray-600">
                        {trip.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaUsers className="text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Travelers
                      </p>
                      <p className="text-sm text-gray-600">
                        {trip.travelers} people
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaDollarSign className="text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Budget
                      </p>
                      <p className="text-sm text-gray-600">
                        ${trip.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{trip.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
                <button
                  onClick={handlePlanActivities}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Plan Activities</span>
                </button>
              </div>

              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Itinerary Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  We're working on building your perfect travel itinerary
                </p>
                <button
                  onClick={handlePlanActivities}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Plan Activities
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
