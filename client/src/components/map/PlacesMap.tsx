import React, { useState, useEffect } from "react";
import { Search, MapPin, Loader2, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SimpleMapComponent, { Place } from "./SimpleMapComponent";
import { placesService } from "@/services/placesService";
import { userActionService } from "@/services/userActionService";
import AddToItineraryDialog from "./AddToItineraryDialog";

interface PlacesMapProps {
  onPlaceSelect?: (place: Place) => void;
  selectedPlaces?: Place[];
  height?: string;
  className?: string;
  tripId?: string; // Optional trip ID for itinerary functionality
}

const PlacesMap: React.FC<PlacesMapProps> = ({
  onPlaceSelect,
  selectedPlaces = [],
  height = "500px",
  className = "",
  tripId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [showItineraryDialog, setShowItineraryDialog] = useState(false);
  const [selectedPlaceForItinerary, setSelectedPlaceForItinerary] =
    useState<Place | null>(null);
  const [likedPlaces, setLikedPlaces] = useState<Set<string>>(new Set());

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    try {
      // Use test endpoint for development (no auth required)
      const results = await placesService.searchPlacesTest(searchQuery, 10);
      setSearchResults(results.results);

      if (results.results.length > 0) {
        // Center map on first result
        const firstResult = results.results[0];
        setMapCenter([
          firstResult.coordinates.lat,
          firstResult.coordinates.lng,
        ]);
        toast.success(`Found ${results.results.length} places`);

        // Record search action
        await userActionService.recordSearch(
          searchQuery,
          results.results.length,
          "map"
        );
      } else {
        toast.info("No places found for your search");

        // Record search action even with no results
        await userActionService.recordSearch(searchQuery, 0, "map");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search places");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle place selection
  const handlePlaceSelect = async (place: Place) => {
    if (onPlaceSelect) {
      onPlaceSelect(place);
      toast.success(`Selected: ${place.name}`);

      // Record place selection action
      await userActionService.recordViewPlace(place, "map");
    }
  };

  // Handle adding place to itinerary
  const handleAddToItinerary = (place: Place) => {
    if (!tripId) {
      toast.error("Trip ID is required to add places to itinerary");
      return;
    }
    setSelectedPlaceForItinerary(place);
    setShowItineraryDialog(true);
  };

  // Handle like/unlike place
  const handleLikePlace = async (place: Place) => {
    const isLiked = likedPlaces.has(place.id);

    if (isLiked) {
      // Unlike
      setLikedPlaces((prev) => {
        const newSet = new Set(prev);
        newSet.delete(place.id);
        return newSet;
      });
      toast.success(`Removed ${place.name} from favorites`);
    } else {
      // Like
      setLikedPlaces((prev) => new Set(prev).add(place.id));
      toast.success(`Added ${place.name} to favorites`);

      // Record like action
      await userActionService.recordLike(place, "map");
    }
  };

  // Handle itinerary dialog close
  const handleItineraryDialogClose = () => {
    setShowItineraryDialog(false);
    setSelectedPlaceForItinerary(null);
  };

  // Combine search results and selected places for map display
  const allPlaces = [...searchResults, ...selectedPlaces];

  return (
    <div className={`w-full ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Places Search & Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Section */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search for places (e.g., Paris, restaurants, hotels)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Search Results ({searchResults.length})
              </h3>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {searchResults.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{place.name}</p>
                      <p className="text-xs text-gray-600">{place.address}</p>
                      {place.category && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {place.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlaceSelect(place)}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLikePlace(place)}
                        className={
                          likedPlaces.has(place.id)
                            ? "text-red-500 border-red-500"
                            : ""
                        }
                      >
                        <Heart
                          className={`h-3 w-3 ${
                            likedPlaces.has(place.id) ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                      {tripId && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleAddToItinerary(place)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Itinerary
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          <div className="border rounded-lg overflow-hidden relative z-[1]">
            <SimpleMapComponent
              places={allPlaces}
              center={mapCenter}
              zoom={13}
              height={height}
              onPlaceSelect={handlePlaceSelect}
            />
          </div>

          {/* Selected Places Summary */}
          {selectedPlaces.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Selected Places ({selectedPlaces.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlaces.map((place) => (
                  <Badge key={place.id} variant="default" className="text-xs">
                    {place.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add to Itinerary Dialog */}
      {tripId && (
        <AddToItineraryDialog
          isOpen={showItineraryDialog}
          onClose={handleItineraryDialogClose}
          place={selectedPlaceForItinerary}
          tripId={tripId}
          onSuccess={() => {
            // Optionally refresh or update something after successful addition
            console.log("Place added to itinerary successfully");
          }}
        />
      )}
    </div>
  );
};

export default PlacesMap;
