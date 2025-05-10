
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Map, User, Plus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleNewTripClick = () => {
    if (isAuthenticated) {
      navigate("/trips");
    } else {
      toast.info("Please log in or create an account to build a trip");
      navigate("/");
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 pb-safe">
      <div className="grid grid-cols-3 h-16">
        <button
          onClick={() => navigate("/")}
          className={cn(
            "flex flex-col items-center justify-center text-xs font-medium",
            isActive("/") 
              ? "text-turquoise-600" 
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </button>
        
        {isAuthenticated ? (
          <>
            <button
              onClick={() => navigate("/trips")}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium",
                isActive("/trips") 
                  ? "text-turquoise-600" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Map className="h-5 w-5 mb-1" />
              <span>My Trips</span>
            </button>
            
            <button
              onClick={() => logout()}
              className="flex flex-col items-center justify-center text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mb-1" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/")}
              className="flex flex-col items-center justify-center text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              <User className="h-5 w-5 mb-1" />
              <span>Login</span>
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="flex flex-col items-center justify-center text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              <User className="h-5 w-5 mb-1" />
              <span>Sign Up</span>
            </button>
          </>
        )}
      </div>
      
      {isAuthenticated && (
        <button
          onClick={handleNewTripClick}
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-turquoise-500 text-white flex items-center justify-center shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
