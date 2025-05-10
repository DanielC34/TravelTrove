
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExploreCard = ({ title, description, imageSrc }: { title: string; description: string; imageSrc: string }) => {
  return (
    <Card className="overflow-hidden hover-scale">
      <div className="relative h-64">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-gray-200 mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
};

const Explore = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 md:pt-28">
        <section className="bg-gradient-to-b from-turquoise-50 to-white py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore the World</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover popular destinations, travel ideas, and inspiration for your next adventure
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Popular Destinations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ExploreCard
                title="Paris, France"
                description="The city of lights and romance"
                imageSrc="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2020&q=80"
              />
              <ExploreCard
                title="Tokyo, Japan"
                description="Where tradition meets innovation"
                imageSrc="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1788&q=80"
              />
              <ExploreCard
                title="New York City, USA"
                description="The city that never sleeps"
                imageSrc="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              />
              <ExploreCard
                title="Bali, Indonesia"
                description="Island paradise with rich culture"
                imageSrc="https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2338&q=80"
              />
              <ExploreCard
                title="Barcelona, Spain"
                description="Architecture, beaches, and vibrant culture"
                imageSrc="https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              />
              <ExploreCard
                title="Cape Town, South Africa"
                description="Where mountains meet the ocean"
                imageSrc="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80"
              />
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start planning?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Create your custom travel itinerary with our AI-powered planner
              </p>
              <Button 
                className="bg-turquoise-500 hover:bg-turquoise-600 text-white text-lg hover-scale turquoise-shadow"
                onClick={() => navigate("/trips")}
              >
                Start Planning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Explore;
