import React, { useState, useEffect } from "react";
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
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import { tripService, Trip } from "@/services/tripService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trip details from API
  const fetchTripDetails = async () => {
    if (!id) {
      setError("Trip ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tripService.getTrip(id);
      setTrip(response.trip);
      setItinerary(response.itinerary);
    } catch (err: any) {
      console.error("Error fetching trip details:", err);
      setError(err.message || "Failed to load trip details");
      toast.error("Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePlanActivities = () => {
    navigate("/trips/new");
  };

  // Loading skeleton component
  const TripDetailSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Trip Info Skeleton */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <Skeleton className="w-full h-48 rounded-lg mb-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Skeleton */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="text-center py-12">
            <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-6 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto mb-4" />
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Trip</h3>
      <p className="text-red-600 mb-4">{error}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={fetchTripDetails}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <FaRedo />
          <span>Try Again</span>
        </button>
        <Link
          to="/trips"
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Trips
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <TripDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState />
        </div>
      </div>
    );
  }

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
                src={`https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&q=80&fit=crop&crop=center`}
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
                  <span className="text-sm text-gray-500">Trip #{trip._id.slice(-6)}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dates</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
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
                        {trip.travelers.count} {trip.travelers.type}
                        {trip.travelers.details && ` - ${trip.travelers.details}`}
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
                        ${trip.budget.amount.toLocaleString()} ({trip.budget.type})
                      </p>
                    </div>
                  </div>
                </div>

                {trip.description && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">{trip.description}</p>
                  </div>
                )}

                {trip.tags && trip.tags.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {trip.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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

              {itinerary ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Itinerary Available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your trip itinerary has been generated
                  </p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                    View Itinerary
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
