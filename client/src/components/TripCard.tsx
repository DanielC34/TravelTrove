
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";

interface TripCardProps {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  progress: number;
  imageSrc?: string;
  onViewTrip: () => void;
}

export function TripCard({
  destination,
  startDate,
  endDate,
  travelers,
  progress,
  imageSrc,
  onViewTrip
}: TripCardProps) {
  const defaultImage = "public/lovable-uploads/9b90244d-5940-404d-a50f-e391db5aea39.png";
  
  return (
    <Card className="overflow-hidden border border-gray-200 hover-scale turquoise-shadow">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageSrc || defaultImage}
          alt={destination}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <CardHeader className="relative -mt-9 pb-0">
        <div className="flex flex-col items-start gap-2">
          <Badge className="bg-turquoise-500 hover:bg-turquoise-600">
            {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
          </Badge>
          <h3 className="text-xl font-semibold text-white">{destination}</h3>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-turquoise-500" />
            <span>{startDate} - {endDate}</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Trip completion</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-gray-100" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-turquoise-50 text-turquoise-700 hover:bg-turquoise-100 border border-turquoise-200 group" 
          onClick={onViewTrip}
        >
          <span>View Trip</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
