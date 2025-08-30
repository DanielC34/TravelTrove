import { Button } from "@/components/ui/button";
import { MapPin, PlusCircle } from "lucide-react";

interface EmptyTripsProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction: () => void;
}

export function EmptyTrips({
  title = "No trips planned yet",
  description = "Start by creating your first trip and let our AI help you plan the perfect getaway.",
  actionText = "Create Your First Trip",
  onAction,
}: EmptyTripsProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
      <div className="flex justify-center">
        <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
          <MapPin className="h-12 w-12 text-gray-300" />
        </div>
      </div>

      <h3 className="mt-6 text-xl font-medium text-gray-900">{title}</h3>

      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        {description}
      </p>

      <div className="mt-6">
        <Button
          onClick={onAction}
          className="bg-turquoise-500 hover:bg-turquoise-600 text-white inline-flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {actionText}
        </Button>
      </div>
    </div>
  );
}
