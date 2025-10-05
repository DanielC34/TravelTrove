import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trash2 } from "lucide-react";
import PlacesMap from "@/components/map/PlacesMap";
import { Place } from "@/components/map/SimpleMapComponent";

const MapTest: React.FC = () => {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  // For testing purposes, we'll use a mock trip ID
  // In a real app, this would come from the current trip context
  const mockTripId = "test-trip-123";

  const handlePlaceSelect = (place: Place) => {
    // Check if place is already selected
    const isAlreadySelected = selectedPlaces.some((p) => p.id === place.id);

    if (!isAlreadySelected) {
      setSelectedPlaces((prev) => [...prev, place]);
    }
  };

  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== placeId));
  };

  const clearAllPlaces = () => {
    setSelectedPlaces([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🗺️ Map Integration Test
          </h1>
          <p className="text-gray-600 mt-2">
            Test the Leaflet map integration with places search functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <PlacesMap
              onPlaceSelect={handlePlaceSelect}
              selectedPlaces={selectedPlaces}
              height="600px"
              tripId={mockTripId}
            />
          </div>

          {/* Selected Places Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Selected Places
                  </span>
                  {selectedPlaces.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllPlaces}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPlaces.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No places selected yet. Search and select places from the
                    map.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {place.name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {place.address}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {place.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {place.category}
                                </Badge>
                              )}
                              {place.country && (
                                <Badge variant="outline" className="text-xs">
                                  {place.country}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              📍 {place.coordinates.lat.toFixed(4)},{" "}
                              {place.coordinates.lng.toFixed(4)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePlace(place.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Search Places</h4>
                  <p className="text-gray-600">
                    Enter a location, city, or type of place (restaurant, hotel,
                    etc.)
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. View Results</h4>
                  <p className="text-gray-600">
                    See search results in the list and markers on the map
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. Select Places</h4>
                  <p className="text-gray-600">
                    Click "Select" or click on map markers to add places
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">4. Manage Selection</h4>
                  <p className="text-gray-600">
                    View selected places in the panel and remove if needed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTest;
