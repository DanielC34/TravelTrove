import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Calendar,
  DollarSign,
  Cloud,
  Car,
  Hotel,
  Utensils,
  Shield,
  Suitcase,
  Lightbulb,
  Loader2,
  Bot,
} from "lucide-react";
import { aiService, TravelRecommendations } from "@/services/aiService";
import { toast } from "sonner";

interface TravelRecommendationsProps {
  destination: string;
  onClose: () => void;
}

export function TravelRecommendations({
  destination,
  onClose,
}: TravelRecommendationsProps) {
  const [recommendations, setRecommendations] =
    useState<TravelRecommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [tripType, setTripType] = useState("general");
  const [budget, setBudget] = useState("moderate");

  const handleGetRecommendations = async () => {
    try {
      setLoading(true);
      const data = await aiService.getTravelRecommendations(
        destination,
        tripType,
        budget
      );
      setRecommendations(data);
      toast.success("Travel recommendations generated!");
    } catch (error: any) {
      console.error("Error getting recommendations:", error);
      toast.error(error.message || "Failed to get travel recommendations");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "bestTimeToVisit":
        return <Calendar className="h-5 w-5" />;
      case "weather":
        return <Cloud className="h-5 w-5" />;
      case "transportation":
        return <Car className="h-5 w-5" />;
      case "accommodation":
        return <Hotel className="h-5 w-5" />;
      case "food":
        return <Utensils className="h-5 w-5" />;
      case "safety":
        return <Shield className="h-5 w-5" />;
      case "budget":
        return <DollarSign className="h-5 w-5" />;
      case "packing":
        return <Suitcase className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getTripTypeLabel = (type: string) => {
    switch (type) {
      case "solo":
        return "Solo Travel";
      case "couple":
        return "Couple";
      case "family":
        return "Family";
      case "business":
        return "Business";
      case "adventure":
        return "Adventure";
      case "relaxation":
        return "Relaxation";
      case "cultural":
        return "Cultural";
      default:
        return "General";
    }
  };

  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case "budget":
        return "Budget";
      case "moderate":
        return "Moderate";
      case "premium":
        return "Premium";
      case "luxury":
        return "Luxury";
      default:
        return "Moderate";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Travel Recommendations</h3>
            <p className="text-gray-600">
              AI-powered insights for {destination}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {!recommendations ? (
          <div className="space-y-6">
            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Trip Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Trip Type
                    </label>
                    <select
                      value={tripType}
                      onChange={(e) => setTripType(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="general">General</option>
                      <option value="solo">Solo Travel</option>
                      <option value="couple">Couple</option>
                      <option value="family">Family</option>
                      <option value="business">Business</option>
                      <option value="adventure">Adventure</option>
                      <option value="relaxation">Relaxation</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Budget Level
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="budget">Budget</option>
                      <option value="moderate">Moderate</option>
                      <option value="premium">Premium</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={handleGetRecommendations}
                disabled={loading}
                className="bg-turquoise-500 hover:bg-turquoise-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {destination} - {getTripTypeLabel(tripType)} Trip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {getTripTypeLabel(tripType)}
                  </Badge>
                  <Badge variant="outline">
                    {getBudgetLabel(budget)} Budget
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(recommendations.recommendations).map(
                ([key, value]) => (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-sm">
                        {getIcon(key)}
                        <span className="ml-2 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Array.isArray(value) ? (
                        <ul className="space-y-1">
                          {value.map((tip, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start"
                            >
                              <span className="mr-2">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">{value}</p>
                      )}
                    </CardContent>
                  </Card>
                )
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setRecommendations(null)}
              >
                Get New Recommendations
              </Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
