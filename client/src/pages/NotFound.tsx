
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 py-20">
          <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-turquoise-100 mb-6 mx-auto">
            <MapPin className="h-12 w-12 text-turquoise-500" />
            <span className="animate-ping absolute h-full w-full rounded-full bg-turquoise-200 opacity-75"></span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Oops! We couldn't find the destination you're looking for.
          </p>
          
          <Button 
            onClick={() => navigate("/")}
            className="bg-turquoise-500 hover:bg-turquoise-600 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
