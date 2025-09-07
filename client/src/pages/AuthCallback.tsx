import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthData } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      toast({
        title: "Authentication Failed",
        description: "Google OAuth authentication failed. Please try again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setAuthData(user, token);
        
        toast({
          title: "Welcome to Travel Trove!",
          description: `Successfully signed in with Google. Welcome, ${user.name}!`,
          variant: "default",
        });
        
        navigate("/explore");
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast({
          title: "Authentication Error",
          description: "Failed to process authentication data.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    } else {
      navigate("/auth");
    }
  }, [searchParams, navigate, setAuthData]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}