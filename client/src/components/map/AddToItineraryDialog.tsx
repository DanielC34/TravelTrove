import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Place } from "./SimpleMapComponent";
import {
  placeItineraryService,
  AddPlaceToItineraryData,
} from "@/services/placeItineraryService";
import { userActionService } from "@/services/userActionService";

interface AddToItineraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  tripId: string;
  onSuccess?: () => void;
}

interface TripDay {
  dayNumber: number;
  date: string;
}

const AddToItineraryDialog: React.FC<AddToItineraryDialogProps> = ({
  isOpen,
  onClose,
  place,
  tripId,
  onSuccess,
}) => {
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<
    "must-see" | "recommended" | "optional"
  >("recommended");
  const [isLoading, setIsLoading] = useState(false);

  // Load trip days when dialog opens
  useEffect(() => {
    if (isOpen && tripId) {
      loadTripDays();
    }
  }, [isOpen, tripId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDay("");
      setStartTime("09:00");
      setEndTime("10:00");
      setNotes("");
      setPriority("recommended");
    }
  }, [isOpen]);

  const loadTripDays = async () => {
    try {
      const days = await placeItineraryService.getTripDays(tripId);
      setTripDays(days);
      if (days.length > 0) {
        setSelectedDay(days[0].dayNumber.toString());
      }

      // Show info message for testing mode
      if (tripId.startsWith("test-") || tripId === "mock-trip") {
        toast.info("Testing mode: Using mock trip data");
      }
    } catch (error) {
      console.error("Error loading trip days:", error);
      toast.error("Failed to load trip days");
    }
  };

  const handleSubmit = async () => {
    if (!place || !selectedDay) {
      toast.error("Please select a day");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setIsLoading(true);
    try {
      const data: AddPlaceToItineraryData = {
        place,
        dayNumber: parseInt(selectedDay),
        startTime,
        endTime,
        notes: notes.trim() || undefined,
        priority,
      };

      await placeItineraryService.addPlaceToItinerary(tripId, data);

      // Record add to itinerary action
      await userActionService.recordAddToItinerary(
        place,
        tripId,
        parseInt(selectedDay),
        priority,
        "itinerary_dialog"
      );

      // Show appropriate success message
      if (tripId.startsWith("test-") || tripId === "mock-trip") {
        toast.success(`Added ${place.name} to your itinerary! (Testing mode)`);
      } else {
        toast.success(`Added ${place.name} to your itinerary!`);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error adding to itinerary:", error);
      toast.error("Failed to add place to itinerary");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "must-see":
        return "bg-red-100 text-red-800";
      case "recommended":
        return "bg-blue-100 text-blue-800";
      case "optional":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!place) return null;

  // Debug logging
  console.log("AddToItineraryDialog render:", { isOpen, place: place?.name });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        console.log("Dialog onOpenChange:", open);
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px] z-[9999] relative">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add to Itinerary
          </DialogTitle>
          <DialogDescription>
            Add this place to your trip itinerary
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Place Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{place.name}</h3>
                <p className="text-sm text-gray-600">{place.address}</p>
                {place.category && (
                  <Badge variant="secondary" className="text-xs mt-2">
                    {place.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Day Selection */}
          <div className="space-y-2">
            <Label htmlFor="day" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Day
            </Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {tripDays.map((day) => (
                  <SelectItem
                    key={day.dayNumber}
                    value={day.dayNumber.toString()}
                  >
                    Day {day.dayNumber} - {formatDate(day.date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(value: "must-see" | "recommended" | "optional") =>
                setPriority(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="must-see">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Must See
                  </div>
                </SelectItem>
                <SelectItem value="recommended">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Recommended
                  </div>
                </SelectItem>
                <SelectItem value="optional">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    Optional
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this place..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add to Itinerary"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToItineraryDialog;
