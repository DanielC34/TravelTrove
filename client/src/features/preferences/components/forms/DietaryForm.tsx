import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import { DietaryRestriction } from "../../interfaces/preferences";

interface DietaryFormProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function DietaryForm({ onComplete, onBack }: DietaryFormProps) {
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setAllergies(allergies.filter((allergy) => allergy !== allergyToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      restrictions,
      allergies,
      additionalNotes,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold">
                Dietary Restrictions
              </Label>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.values(DietaryRestriction).map((restriction) => (
                  <div
                    key={restriction}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={restriction}
                      checked={restrictions.includes(restriction)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRestrictions([...restrictions, restriction]);
                        } else {
                          setRestrictions(
                            restrictions.filter((r) => r !== restriction)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={restriction} className="capitalize">
                      {restriction.replace("_", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Allergies</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add allergy..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddAllergy}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {allergies.map((allergy) => (
                    <div
                      key={allergy}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                    >
                      <span className="text-sm">{allergy}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(allergy)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Additional Notes</Label>
              <Textarea
                placeholder="Any other dietary requirements or preferences..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
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
