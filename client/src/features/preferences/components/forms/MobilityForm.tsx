import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { MobilityLevel } from "../../interfaces/preferences";

interface MobilityFormProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function MobilityForm({ onComplete, onBack }: MobilityFormProps) {
  const [mobilityLevel, setMobilityLevel] = useState<MobilityLevel>(
    MobilityLevel.NO_RESTRICTIONS
  );
  const [requiresWheelchairAccess, setRequiresWheelchairAccess] =
    useState(false);
  const [maxWalkingDistance, setMaxWalkingDistance] = useState<number[]>([
    1000,
  ]);
  const [additionalNeeds, setAdditionalNeeds] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      mobilityLevel,
      requiresWheelchairAccess,
      maxWalkingDistance: maxWalkingDistance[0],
      additionalNeeds,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold">Mobility Level</Label>
              <RadioGroup
                value={mobilityLevel}
                onValueChange={(value) =>
                  setMobilityLevel(value as MobilityLevel)
                }
                className="grid gap-4 mt-4"
              >
                {Object.values(MobilityLevel).map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={level} />
                    <Label htmlFor={level} className="capitalize">
                      {level.replace(/_/g, " ")}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">
                Requires Wheelchair Access
              </Label>
              <Switch
                checked={requiresWheelchairAccess}
                onCheckedChange={setRequiresWheelchairAccess}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Maximum Walking Distance (meters)
              </Label>
              <Slider
                value={maxWalkingDistance}
                onValueChange={setMaxWalkingDistance}
                max={5000}
                min={100}
                step={100}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground text-center">
                {maxWalkingDistance[0]} meters
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Additional Needs</Label>
              <Textarea
                placeholder="Any other mobility requirements or preferences..."
                value={additionalNeeds}
                onChange={(e) => setAdditionalNeeds(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
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
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
