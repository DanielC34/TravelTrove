import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Hotel } from "lucide-react";

interface BudgetFormProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function BudgetForm({ onComplete, onBack }: BudgetFormProps) {
  const [currency, setCurrency] = useState("USD");
  const [budgetRange, setBudgetRange] = useState<number[]>([2000]);
  const [accommodationLevel, setAccommodationLevel] = useState<
    1 | 2 | 3 | 4 | 5
  >(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      currency,
      minPerDay: budgetRange[0] * 0.8,
      maxPerDay: budgetRange[0] * 1.2,
      preferredAccommodationLevel: accommodationLevel,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold">
                Preferred Currency
              </Label>
              <RadioGroup
                value={currency}
                onValueChange={setCurrency}
                className="grid grid-cols-2 gap-4 mt-4"
              >
                {["USD", "EUR", "GBP", "JPY"].map((curr) => (
                  <div key={curr} className="flex items-center space-x-2">
                    <RadioGroupItem value={curr} id={curr} />
                    <Label htmlFor={curr}>{curr}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Daily Budget Range ({currency})
              </Label>
              <Slider
                value={budgetRange}
                onValueChange={setBudgetRange}
                max={10000}
                min={50}
                step={50}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground text-center">
                {budgetRange[0]} {currency} per day
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Preferred Accommodation Level
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setAccommodationLevel(level as 1 | 2 | 3 | 4 | 5)
                    }
                    className={`p-3 rounded-lg flex flex-col items-center gap-1 ${
                      accommodationLevel === level
                        ? "bg-turquoise-50 border-2 border-turquoise-500"
                        : "border-2 border-gray-200 hover:border-turquoise-200"
                    }`}
                  >
                    <Hotel
                      className={`h-5 w-5 ${
                        accommodationLevel === level
                          ? "text-turquoise-500"
                          : "text-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {level} {level === 1 ? "Star" : "Stars"}
                    </span>
                  </button>
                ))}
              </div>
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
