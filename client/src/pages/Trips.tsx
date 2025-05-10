
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { TripCard } from "@/components/TripCard";
import { EmptyTrips } from "@/components/EmptyTrips";
import { TripBuilder } from "@/components/TripBuilder";

const mockTrips = [
  {
    id: 1,
    destination: "Las Vegas",
    startDate: "Jul 24",
    endDate: "Jul 26, 2024",
    travelers: 2,
    progress: 65,
    imageSrc: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2148&q=80"
  },
  {
    id: 2,
    destination: "Paris",
    startDate: "Aug 10",
    endDate: "Aug 17, 2024",
    travelers: 2,
    progress: 40,
    imageSrc: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2020&q=80"
  },
  {
    id: 3,
    destination: "Tokyo",
    startDate: "Oct 5",
    endDate: "Oct 15, 2024",
    travelers: 1,
    progress: 20,
    imageSrc: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1788&q=80"
  },
];

const Trips = () => {
  const [trips, setTrips] = useState(mockTrips);
  const [showTripBuilder, setShowTripBuilder] = useState(false);
  
  const handleViewTrip = (id: number) => {
    // In a real app, this would navigate to a trip detail page
    console.log("View trip:", id);
  };
  
  const handleCreateTrip = () => {
    setShowTripBuilder(true);
  };
  
  const handleTripComplete = (tripData: any) => {
    // In a real app, this would call an API to save the trip
    const newTrip = {
      id: trips.length + 1,
      destination: tripData.destination,
      startDate: tripData.date.split(',')[0],
      endDate: tripData.date,
      travelers: tripData.travelers,
      progress: 10,
      // Add default image source for new trips
      imageSrc: "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2348&q=80"
    };
    
    setTrips([...trips, newTrip]);
    setShowTripBuilder(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 md:pt-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Trips</h1>
              <p className="text-gray-600 mt-1">Manage and plan your upcoming adventures</p>
            </div>
            
            <Button 
              className="mt-4 md:mt-0 bg-turquoise-500 hover:bg-turquoise-600 text-white"
              onClick={handleCreateTrip}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Trip
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming" className="mt-6">
            <TabsList className="mb-8">
              <TabsTrigger 
                value="upcoming" 
                className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700"
              >
                Past Trips
              </TabsTrigger>
              <TabsTrigger 
                value="drafts" 
                className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700"
              >
                Drafts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-0 animate-fade-in">
              {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      destination={trip.destination}
                      startDate={trip.startDate}
                      endDate={trip.endDate}
                      travelers={trip.travelers}
                      progress={trip.progress}
                      imageSrc={trip.imageSrc}
                      onViewTrip={() => handleViewTrip(trip.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyTrips onCreateTrip={handleCreateTrip} />
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0 animate-fade-in">
              <EmptyTrips onCreateTrip={handleCreateTrip} />
            </TabsContent>
            
            <TabsContent value="drafts" className="mt-0 animate-fade-in">
              <EmptyTrips onCreateTrip={handleCreateTrip} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
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
      
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Trips;
