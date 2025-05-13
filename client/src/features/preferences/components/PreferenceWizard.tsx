import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "./forms/BasicInfoForm";
import { DietaryForm } from "./forms/DietaryForm";
import { MobilityForm } from "./forms/MobilityForm";
import { BudgetForm } from "./forms/BudgetForm";
import { ActivityForm } from "./forms/ActivityForm";
import { Progress } from "@/components/ui/progress";
import type { UserPreferences } from "../interfaces/preferences";

interface PreferencesWizardProps {
  onComplete: (preferences: UserPreferences) => void;
  initialPreferences?: Partial<UserPreferences>;
}

type PreferencesStep = "basic" | "dietary" | "mobility" | "budget" | "activity";

export function PreferencesWizard({
  onComplete,
  initialPreferences,
}: PreferencesWizardProps) {
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>(
    initialPreferences || {}
  );
  const [currentStep, setCurrentStep] = useState<PreferencesStep>("basic");
  const [progress, setProgress] = useState(0);

  const steps: PreferencesStep[] = [
    "basic",
    "dietary",
    "mobility",
    "budget",
    "activity",
  ];

  const updateProgress = (step: PreferencesStep) => {
    const currentIndex = steps.indexOf(step);
    const nextProgress = ((currentIndex + 1) / steps.length) * 100;
    setProgress(nextProgress);
  };

  const handleStepComplete = (step: PreferencesStep, data: any) => {
    setPreferences((prev) => ({
      ...prev,
      ...data,
    }));

    const currentIndex = steps.indexOf(step);
    const nextStep = steps[currentIndex + 1];

    if (nextStep) {
      setCurrentStep(nextStep);
      updateProgress(nextStep);
    } else {
      // All steps completed, send full preferences object
      onComplete({
        ...preferences,
        ...data,
        lastUpdated: new Date(),
      } as UserPreferences);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setCurrentStep(prevStep);
      updateProgress(prevStep);
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
        value={currentStep}
        onValueChange={(v) => setCurrentStep(v as PreferencesStep)}
      >
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="dietary">Dietary</TabsTrigger>
          <TabsTrigger value="mobility">Mobility</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoForm
            initialValues={preferences}
            onComplete={(data) => handleStepComplete("basic", data)}
          />
        </TabsContent>

        <TabsContent value="dietary">
          <DietaryForm
            initialValues={preferences.dietary}
            onComplete={(data) =>
              handleStepComplete("dietary", { dietary: data })
            }
            onBack={handleBack}
          />
        </TabsContent>

        <TabsContent value="mobility">
          <MobilityForm
            initialValues={preferences.mobility}
            onComplete={(data) =>
              handleStepComplete("mobility", { mobility: data })
            }
            onBack={handleBack}
          />
        </TabsContent>

        <TabsContent value="budget">
          <BudgetForm
            initialValues={preferences.budget}
            onComplete={(data) =>
              handleStepComplete("budget", { budget: data })
            }
            onBack={handleBack}
          />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityForm
            onComplete={(data) =>
              handleStepComplete("activity", { activityLevels: data })
            }
            onBack={handleBack}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
