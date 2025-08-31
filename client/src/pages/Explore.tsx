import React, { useState } from "react";
import {
  FaSearch,
  FaStar,
  FaHeart,
  FaMapMarkedAlt,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const destinations = [
    {
      id: 1,
      name: "Paris, France",
      image:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400",
      rating: 4.8,
      reviews: 1247,
      price: "$1,200",
      category: "city",
      description:
        "The City of Light offers iconic landmarks, world-class museums, and romantic experiences.",
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      rating: 4.9,
      reviews: 892,
      price: "$2,100",
      category: "city",
      description:
        "A perfect blend of traditional culture and cutting-edge technology.",
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
      rating: 4.7,
      reviews: 1563,
      price: "$800",
      category: "beach",
      description:
        "Tropical paradise with stunning beaches, temples, and vibrant culture.",
    },
    {
      id: 4,
      name: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
      rating: 4.6,
      reviews: 2103,
      price: "$1,500",
      category: "city",
      description:
        "The city that never sleeps offers endless entertainment and iconic sights.",
    },
    {
      id: 5,
      name: "Santorini, Greece",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400",
      rating: 4.9,
      reviews: 743,
      price: "$1,800",
      category: "island",
      description:
        "Stunning sunsets, white-washed buildings, and crystal-clear waters.",
    },
    {
      id: 6,
      name: "Machu Picchu, Peru",
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400",
      rating: 4.8,
      reviews: 567,
      price: "$1,300",
      category: "adventure",
      description: "Ancient Incan citadel perched high in the Andes Mountains.",
    },
  ];

  const categories = [
    { id: "all", name: "All Destinations" },
    { id: "city", name: "Cities" },
    { id: "beach", name: "Beaches" },
    { id: "island", name: "Islands" },
    { id: "adventure", name: "Adventure" },
  ];

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || destination.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Destinations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing places around the world and start planning your
            next adventure
            </p>
          </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                    <FaHeart className="text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {destination.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-white text-sm font-medium">
                        {destination.rating}
                      </span>
                    </div>
                    <span className="text-white/80 text-sm">
                      ({destination.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">
                  {destination.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FaMapMarkedAlt className="text-blue-600" />
                      <span>Popular</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaUsers className="text-green-600" />
                      <span>Family-friendly</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaDollarSign className="text-yellow-600" />
                    <span className="font-semibold text-gray-900">
                      {destination.price}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium">
                    Plan Trip
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaHeart className="text-gray-600 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
              <FaSearch className="text-gray-400 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No destinations found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
