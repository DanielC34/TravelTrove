import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaEye,
  FaExclamationTriangle,
  FaRedo,
  FaPlane,
} from "react-icons/fa";
import { tripService, Trip } from "@/services/tripService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trips from API
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const tripsData = await tripService.getTrips();
      setTrips(tripsData);
    } catch (err: any) {
      console.error("Error fetching trips:", err);
      setError(err.message || "Failed to load trips");
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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

  // Loading skeleton component
  const TripsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <Skeleton className="w-full h-48" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Failed to Load Trips
      </h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={fetchTrips}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
      >
        <FaRedo />
        <span>Try Again</span>
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
      <FaPlane className="text-blue-500 text-4xl mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-blue-800 mb-2">No Trips Yet</h3>
      <p className="text-blue-600 mb-4">
        Start planning your first adventure by creating a new trip!
      </p>
      <Link
        to="/trips/new"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
      >
        <FaPlus />
        <span>Create Your First Trip</span>
      </Link>
    </div>
  );

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
        {loading ? (
          <TripsSkeleton />
        ) : error ? (
          <ErrorState />
        ) : trips.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={`https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&q=80&fit=crop&crop=center`}
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
                          {trip.travelers.count} traveler
                          {trip.travelers.count > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaDollarSign className="text-yellow-600" />
                        <span>${trip.budget.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/trips/${trip._id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
