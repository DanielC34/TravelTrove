import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Heart,
  MapPin,
  Plus,
  Eye,
  Calendar,
  TrendingUp,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  userActionService,
  UserActionStats,
  PopularPlace,
  SearchAnalytics,
} from "@/services/userActionService";
import { toast } from "sonner";

interface UserActionAnalyticsProps {
  className?: string;
}

const UserActionAnalytics: React.FC<UserActionAnalyticsProps> = ({
  className = "",
}) => {
  const [stats, setStats] = useState<UserActionStats[]>([]);
  const [popularPlaces, setPopularPlaces] = useState<PopularPlace[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [statsData, popularData, searchData] = await Promise.all([
        userActionService.getUserStats(),
        userActionService.getPopularPlaces(5),
        userActionService.getSearchAnalytics(),
      ]);

      setStats(statsData);
      setPopularPlaces(popularData);
      setSearchAnalytics(searchData);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "search":
        return <Search className="h-4 w-4" />;
      case "like":
        return <Heart className="h-4 w-4" />;
      case "add_poi":
        return <MapPin className="h-4 w-4" />;
      case "add_to_itinerary":
        return <Plus className="h-4 w-4" />;
      case "view_place":
        return <Eye className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "search":
        return "bg-blue-100 text-blue-800";
      case "like":
        return "bg-red-100 text-red-800";
      case "add_poi":
        return "bg-green-100 text-green-800";
      case "add_to_itinerary":
        return "bg-purple-100 text-purple-800";
      case "view_place":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Activity</h2>
          <p className="text-gray-600">Track your travel planning actions</p>
        </div>
        <Button
          onClick={loadAnalytics}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Action Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Action Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.actionType}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${getActionColor(
                        stat.actionType
                      )}`}
                    >
                      {getActionIcon(stat.actionType)}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {stat.actionType.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last: {formatDate(stat.lastAction)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {stat.count}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity data available</p>
              <p className="text-sm">Start exploring to see your statistics!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Places */}
      {popularPlaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Popular Places
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularPlaces.map((place, index) => (
                <div
                  key={place.placeId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{place.placeName}</p>
                      <p className="text-sm text-gray-600">
                        {place.placeCategory} • {place.actionCount} actions
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {place.actions.map((action) => (
                      <Badge key={action} variant="outline" className="text-xs">
                        {action.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Analytics */}
      {searchAnalytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchAnalytics.slice(0, 10).map((search) => (
                <div
                  key={search.query}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">"{search.query}"</p>
                    <p className="text-sm text-gray-600">
                      {search.searchCount} searches •{" "}
                      {search.avgResultCount.toFixed(1)} avg results
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{search.searchCount}</Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(search.lastSearch)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserActionAnalytics;
