import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface BasicInfoFormProps {
  onComplete: (data: any) => void;
}

export function BasicInfoForm({ onComplete }: BasicInfoFormProps) {
  const [travelStyle, setTravelStyle] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      travelStyle,
      experiences,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">Travel Style</Label>
              <RadioGroup
                value={travelStyle}
                onValueChange={setTravelStyle}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem
                    value="adventure"
                    id="adventure"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="adventure"
                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    Adventure
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="relaxation"
                    id="relaxation"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="relaxation"
                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    Relaxation
                  </Label>
                </div>
                {/* Add Cultural and Foodie options similarly */}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">
                Must-Have Experiences
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="outdoor"
                    checked={experiences.includes("outdoor")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setExperiences([...experiences, "outdoor"]);
                      } else {
                        setExperiences(
                          experiences.filter((e) => e !== "outdoor")
                        );
                      }
                    }}
                  />
                  <Label htmlFor="outdoor">Outdoor Activities</Label>
                </div>
                {/* Add other experience checkboxes similarly */}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
