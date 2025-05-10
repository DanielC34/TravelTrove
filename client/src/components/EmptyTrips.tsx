
import { Button } from "@/components/ui/button";
import { MapPin, PlusCircle } from "lucide-react";

interface EmptyTripsProps {
  onCreateTrip: () => void;
}

export function EmptyTrips({ onCreateTrip }: EmptyTripsProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
      <div className="flex justify-center">
        <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
          <MapPin className="h-12 w-12 text-gray-300" />
        </div>
      </div>
      
      <h3 className="mt-6 text-xl font-medium text-gray-900">No trips planned yet</h3>
      
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        Start by creating your first trip and let our AI help you plan the perfect getaway.
      </p>
      
      <div className="mt-6">
        <Button 
          onClick={onCreateTrip}
          className="bg-turquoise-500 hover:bg-turquoise-600 text-white inline-flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Trip
        </Button>
      </div>
    </div>
  );
}
