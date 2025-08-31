import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaSave, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { tripService, CreateTripData } from "@/services/tripService";
import { toast } from "sonner";

interface FormData {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: {
    amount: number;
    currency: string;
    type: "budget" | "moderate" | "premium" | "luxury";
  };
  travelers: {
    count: number;
    type: "solo" | "couple" | "family" | "group";
    details?: string;
  };
  description: string;
  tags: string[];
}

interface FormErrors {
  [key: string]: string;
}

const CreateTrip = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: {
      amount: 0,
      currency: "USD",
      type: "moderate",
    },
    travelers: {
      count: 1,
      type: "solo",
      details: "",
    },
    description: "",
    tags: [],
  });

  // Validate form data before submission
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = "Trip name is required";
    }
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (formData.budget.amount <= 0) {
      newErrors.budget = "Budget must be greater than 0";
    }
    if (formData.travelers.count < 1) {
      newErrors.travelers = "At least one traveler is required";
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const now = new Date();
      
      if (start < now) {
        newErrors.startDate = "Start date cannot be in the past";
      }
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNestedChange = (parentField: string, childField: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof FormData],
        [childField]: value,
      },
    }));
    
    // Clear error when user starts typing
    if (errors[parentField]) {
      setErrors(prev => ({ ...prev, [parentField]: "" }));
    }
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform form data to match backend expectations
      const tripData: CreateTripData = {
        name: formData.name.trim(),
        destination: formData.destination.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: {
          amount: formData.budget.amount,
          currency: formData.budget.currency,
          type: formData.budget.type,
        },
        travelers: {
          count: formData.travelers.count,
          type: formData.travelers.type,
          details: formData.travelers.details || undefined,
        },
        description: formData.description.trim() || undefined,
        tags: formData.tags.filter(tag => tag.trim()),
      };

      // Call the API service
      const createdTrip = await tripService.createTrip(tripData);
      
      toast.success("Trip created successfully!");
      
      // Redirect to the newly created trip detail page
      navigate(`/trips/${createdTrip._id}`);
      
    } catch (error: any) {
      console.error("Error creating trip:", error);
      
      // Show user-friendly error message
      const errorMessage = error.message || "Failed to create trip. Please try again.";
      toast.error(errorMessage);
      
      // Set specific field errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Trip
              </h1>
              <p className="text-gray-600 mt-2">Plan your perfect adventure</p>
            </div>
            <button
              onClick={() => navigate("/trips")}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Trip Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trip Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Paris Adventure"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.destination ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Paris, France"
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.destination}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                min={formData.startDate}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.endDate}
                </p>
              )}
            </div>

            {/* Budget Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount (USD) *
              </label>
              <input
                type="number"
                value={formData.budget.amount}
                onChange={(e) => handleNestedChange("budget", "amount", parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.budget ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.budget}
                </p>
              )}
            </div>

            {/* Budget Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Type *
              </label>
              <select
                value={formData.budget.type}
                onChange={(e) => handleNestedChange("budget", "type", e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            {/* Number of Travelers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Travelers *
              </label>
              <input
                type="number"
                value={formData.travelers.count}
                onChange={(e) => handleNestedChange("travelers", "count", parseInt(e.target.value) || 1)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.travelers ? "border-red-500" : "border-gray-300"
                }`}
                min="1"
              />
              {errors.travelers && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.travelers}
                </p>
              )}
            </div>

            {/* Traveler Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Traveler Type *
              </label>
              <select
                value={formData.travelers.type}
                onChange={(e) => handleNestedChange("travelers", "type", e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>

          {/* Traveler Details */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traveler Details (Optional)
            </label>
            <input
              type="text"
              value={formData.travelers.details}
              onChange={(e) => handleNestedChange("travelers", "details", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2 adults, 1 child"
            />
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about your trip plans..."
            />
          </div>

          {/* Trip Duration Display */}
          {getDuration() > 0 && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Trip Duration:</strong> {getDuration()} days
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/trips")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Trip...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Create Trip</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
