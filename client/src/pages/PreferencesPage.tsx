import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PreferencesWizard } from "@/features/preferences/components/PreferenceWizard";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import type { UserPreferences } from "@/features/preferences/interfaces/preferences";

export default function PreferencesPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreferencesComplete = async (preferences: UserPreferences) => {
    try {
      setIsSubmitting(true);
      // TODO: Add API call to save preferences
      await savePreferences(preferences);

      toast.success("Preferences saved successfully!");
      navigate("/trips"); // Or wherever you want to redirect after
    } catch (error) {
      toast.error("Failed to save preferences. Please try again.");
      console.error("Error saving preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 md:pt-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <PreferencesWizard onComplete={handlePreferencesComplete} />
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

// Temporary mock function - replace with actual API call
async function savePreferences(preferences: UserPreferences): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In reality, you would make a fetch/axios call to your backend here
  console.log("Saving preferences:", preferences);
}
