import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  MoreVertical,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { Trip } from "@/services/tripService";
import { useNavigate } from "react-router-dom";

interface TripCardProps {
  trip: Trip;
  onView: () => void;
  onDelete: () => void;
  onStatusChange: (status: Trip["status"]) => void;
}

export function TripCard({
  trip,
  onView,
  onDelete,
  onStatusChange,
}: TripCardProps) {
  const navigate = useNavigate();
  const defaultImage =
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2348&q=80";

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd");
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (status: Trip["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "planning":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "draft":
        return <Edit className="h-4 w-4 text-gray-500" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressValue = (status: Trip["status"]) => {
    switch (status) {
      case "completed":
        return 100;
      case "confirmed":
        return 80;
      case "planning":
        return 60;
      case "draft":
        return 20;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const getBudgetDisplay = () => {
    const amount = trip.budget.amount;
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount}`;
  };

  const handleViewTrip = () => {
    navigate(`/trips/${trip._id}`);
  };
  
  return (
    <Card className="overflow-hidden border border-gray-200 hover-scale turquoise-shadow">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={defaultImage}
          alt={trip.destination}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={`${getStatusColor(trip.status)} text-xs font-medium`}
          >
            <span className="mr-1">{getStatusIcon(trip.status)}</span>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 left-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/30"
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewTrip}>
                <ArrowRight className="mr-2 h-4 w-4" />
                View Trip
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("planning")}>
                <Clock className="mr-2 h-4 w-4" />
                Mark as Planning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("confirmed")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Confirmed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("completed")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardHeader className="relative -mt-9 pb-0">
        <div className="flex flex-col items-start gap-2">
          <Badge className="bg-turquoise-500 hover:bg-turquoise-600">
            {trip.travelers.count}{" "}
            {trip.travelers.count === 1 ? "Traveler" : "Travelers"}
          </Badge>
          <h3 className="text-xl font-semibold text-white">{trip.name}</h3>
          <p className="text-sm text-white/80">{trip.destination}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-turquoise-500" />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-turquoise-500" />
              <span>
                {trip.travelers.type.charAt(0).toUpperCase() +
                  trip.travelers.type.slice(1)}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {getBudgetDisplay()}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Trip progress</span>
              <span className="font-medium">
                {getProgressValue(trip.status)}%
              </span>
            </div>
            <Progress
              value={getProgressValue(trip.status)}
              className="h-1.5 bg-gray-100"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-turquoise-50 text-turquoise-700 hover:bg-turquoise-100 border border-turquoise-200 group" 
          onClick={handleViewTrip}
        >
          <span>View Trip</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
