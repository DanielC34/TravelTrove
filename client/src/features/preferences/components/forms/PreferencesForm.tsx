import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "./forms/BasicInfoForm";
import { DietaryForm } from "./forms/DietaryForm";
import { MobilityForm } from "./forms/MobilityForm";
import { BudgetForm } from "./forms/BudgetForm";
import { ActivityForm } from "./forms/ActivityForm";
import { Progress } from "@/components/ui/progress";

type PreferencesStep = "basic" | "dietary" | "mobility" | "budget" | "activity";

interface PreferencesFormProps {
  onComplete: (preferences: any) => void;
}

export function PreferencesForm({ onComplete }: PreferencesFormProps) {
  const [activeStep, setActiveStep] = useState<PreferencesStep>("basic");
  const [progress, setProgress] = useState(0);

  const steps: PreferencesStep[] = [
    "basic",
    "dietary",
    "mobility",
    "budget",
    "activity",
  ];

  const handleStepComplete = (step: PreferencesStep, data: any) => {
    // Update progress
    const currentIndex = steps.indexOf(step);
    const nextProgress = ((currentIndex + 1) / steps.length) * 100;
    setProgress(nextProgress);

    // Move to next step or complete
    const nextStep = steps[currentIndex + 1];
    if (nextStep) {
      setActiveStep(nextStep);
    } else {
      onComplete(data);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">
          Your Travel Preferences
        </h2>
        <Progress value={progress} className="h-2" />
      </div>

      <Tabs
        value={activeStep}
        onValueChange={(v) => setActiveStep(v as PreferencesStep)}
      >
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="dietary">Dietary</TabsTrigger>
          <TabsTrigger value="mobility">Mobility</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoForm
            onComplete={(data) => handleStepComplete("basic", data)}
          />
        </TabsContent>

        <TabsContent value="dietary">
          <DietaryForm
            onComplete={(data) => handleStepComplete("dietary", data)}
          />
        </TabsContent>

        <TabsContent value="mobility">
          <MobilityForm
            onComplete={(data) => handleStepComplete("mobility", data)}
          />
        </TabsContent>

        <TabsContent value="budget">
          <BudgetForm
            onComplete={(data) => handleStepComplete("budget", data)}
          />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityForm
            onComplete={(data) => handleStepComplete("activity", data)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
