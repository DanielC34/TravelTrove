import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

// Define a concrete type for the form's output
export interface ActivityData {
  hiking: number;
  water: number;
  heights: number;
  crowdedPlaces: number;
}

interface ActivityFormProps {
  onComplete: (data: ActivityData) => void;
  onBack: () => void;
}

export function ActivityForm({ onComplete, onBack }: ActivityFormProps) {
  // We keep the internal state as number arrays for the Slider
  const [activityLevels, setActivityLevels] = useState<
    Record<keyof ActivityData, number[]>
  >({
    hiking: [3],
    water: [3],
    heights: [3],
    crowdedPlaces: [3],
  });

  const handleSliderChange = (
    activity: keyof ActivityData,
    value: number[]
  ) => {
    setActivityLevels((prev) => ({
      ...prev,
      [activity]: value,
    }));
  };

  const getComfortLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Very Uncomfortable";
      case 2:
        return "Somewhat Uncomfortable";
      case 3:
        return "Neutral";
      case 4:
        return "Comfortable";
      case 5:
        return "Very Comfortable";
      default:
        return "Neutral";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: ActivityData = {
      hiking: activityLevels.hiking[0],
      water: activityLevels.water[0],
      heights: activityLevels.heights[0],
      crowdedPlaces: activityLevels.crowdedPlaces[0],
    };
    onComplete(data);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {Object.entries(activityLevels).map(([activity, value]) => (
              <div key={activity} className="space-y-4">
                <Label className="text-lg font-semibold capitalize">
                  {activity.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <Slider
                  value={value}
                  onValueChange={(newValue) =>
                    handleSliderChange(activity as keyof ActivityData, newValue)
                  }
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground text-center">
                  {getComfortLabel(value[0])}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="submit" className="flex-1">
              Complete <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
