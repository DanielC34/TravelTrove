
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { AuthModal } from "@/components/AuthModal";
import { TripBuilder } from "@/components/TripBuilder";
import { Footer } from "@/components/Footer";
import { MapPin, PlayCircle, ArrowRight, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [showTripBuilder, setShowTripBuilder] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuthStore();
  
  const handleTripBuilderClick = () => {
    if (isAuthenticated) {
      setShowTripBuilder(true);
    } else {
      toast.info("Please log in or create an account to build a trip");
      setShowAuthModal(true);
    }
  };
  
  const handleTripComplete = (tripData: any) => {
    setShowTripBuilder(false);
    navigate("/trips");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-turquoise-50 to-white z-0"></div>
        <div className="absolute right-0 top-1/4 w-64 h-64 bg-turquoise-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute left-1/4 bottom-1/4 w-40 h-40 bg-turquoise-200 rounded-full filter blur-2xl opacity-20"></div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-5">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Discover your next adventure with <span className="text-turquoise-600">AI-powered</span> travel planning
            </h1>
            <p className="text-lg md:text-xl text-gray-600 md:px-10">
              Plan your perfect trip in minutes, not hours. Our AI creates personalized travel itineraries tailored to your preferences.
            </p>
            
            <div className="pt-5 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-turquoise-500 hover:bg-turquoise-600 text-white py-6 px-8 text-lg font-medium hover-scale turquoise-shadow animate-fade-in"
                onClick={handleTripBuilderClick}
              >
                Build My Trip <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-turquoise-200 text-turquoise-700 hover:bg-turquoise-50 py-6 px-8 text-lg font-medium hover-scale"
                onClick={() => navigate("/explore")}
              >
                <PlayCircle className="mr-2 h-5 w-5" /> See How It Works
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <button 
            onClick={() => {
              const featuresSection = document.getElementById('features');
              featuresSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-gray-500 hover:text-turquoise-500 transition-colors animate-bounce pb-4"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How TravelAI Works</h2>
            <p className="text-lg text-gray-600">
              Our AI-powered platform makes trip planning effortless and personalized
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-xl hover-scale animate-fade-in">
              <div className="bg-turquoise-100 rounded-full w-12 h-12 flex items-center justify-center mb-5">
                <MapPin className="h-6 w-6 text-turquoise-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tell us your preferences</h3>
              <p className="text-gray-600">
                Share your travel style, budget, and interests so our AI can understand what you're looking for.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-xl hover-scale animate-fade-in [animation-delay:200ms]">
              <div className="bg-turquoise-100 rounded-full w-12 h-12 flex items-center justify-center mb-5">
                <svg className="h-6 w-6 text-turquoise-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI generates your itinerary</h3>
              <p className="text-gray-600">
                Our advanced AI creates a custom travel plan with accommodations, activities, and dining recommendations.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-xl hover-scale animate-fade-in [animation-delay:400ms]">
              <div className="bg-turquoise-100 rounded-full w-12 h-12 flex items-center justify-center mb-5">
                <svg className="h-6 w-6 text-turquoise-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customize and book</h3>
              <p className="text-gray-600">
                Fine-tune your itinerary, make adjustments, and book directly through our integrated partners.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to plan your next adventure?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of travelers who have discovered the power of AI-assisted travel planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button
                  className="bg-turquoise-500 hover:bg-turquoise-600 text-white text-lg hover-scale turquoise-shadow"
                  onClick={handleTripBuilderClick}
                >
                  Start Planning Now
                </Button>
              ) : (
                <>
                  <Button
                    className="bg-turquoise-500 hover:bg-turquoise-600 text-white text-lg hover-scale turquoise-shadow"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Create Free Account
                  </Button>
                  <Button
                    variant="outline"
                    className="border-turquoise-200 text-turquoise-700 hover:bg-turquoise-50 text-lg hover-scale"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Log In To Account
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Trip Builder Modal */}
      {showTripBuilder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-2xl font-semibold">Build Your Trip</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTripBuilder(false)}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <div className="p-6">
              <TripBuilder onComplete={handleTripComplete} />
            </div>
          </div>
        </div>
      )}
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      
      <div className="mt-auto">
        <Footer />
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Index;
