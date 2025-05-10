
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  Users,
  User,
  Heart,
  Home,
  DollarSign,
  Bot,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface TripBuilderProps {
  onComplete: (tripData: any) => void;
}

export function TripBuilder({ onComplete }: TripBuilderProps) {
  const [activeTab, setActiveTab] = useState("travelers");
  const [travelers, setTravelers] = useState<"solo" | "couple" | "family">("solo");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [budget, setBudget] = useState([50]);
  const [destination, setDestination] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const moveToNextTab = () => {
    if (activeTab === "travelers") {
      setActiveTab("dates");
    } else if (activeTab === "dates") {
      setActiveTab("budget");
    } else if (activeTab === "budget") {
      setActiveTab("ai");
    }
  };

  const moveToPrevTab = () => {
    if (activeTab === "dates") {
      setActiveTab("travelers");
    } else if (activeTab === "budget") {
      setActiveTab("dates");
    } else if (activeTab === "ai") {
      setActiveTab("budget");
    }
  };

  const getTravelersCount = () => {
    if (travelers === "solo") return 1;
    if (travelers === "couple") return 2;
    return 4;
  };

  const getBudgetLabel = () => {
    if (budget[0] <= 25) return "Budget";
    if (budget[0] <= 50) return "Moderate";
    if (budget[0] <= 75) return "Premium";
    return "Luxury";
  };

  const handleGenerateAI = () => {
    if (!destination) {
      toast.error("Please enter a destination");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setPrompt(`Create a ${getBudgetLabel().toLowerCase()} ${travelers} trip to ${destination} for ${getTravelersCount()} travelers`);
      toast.success("AI prompt generated successfully!");
    }, 2000);
  };

  const handleCreateTrip = () => {
    if (!prompt) {
      toast.error("Please generate an AI prompt first");
      return;
    }
    
    const tripData = {
      destination,
      travelers: getTravelersCount(),
      travelerType: travelers,
      date: date ? format(date, "MMM dd, yyyy") : "",
      budget: getBudgetLabel(),
      prompt,
    };
    
    toast.success("Trip created successfully!");
    onComplete(tripData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="travelers" className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700">
            Who's Going?
          </TabsTrigger>
          <TabsTrigger value="dates" className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700">
            When?
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700">
            Budget
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700">
            AI Prompt
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="travelers" className="mt-6 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-center">Who's traveling with you?</h3>
                
                <RadioGroup value={travelers} onValueChange={(v) => setTravelers(v as any)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem 
                      value="solo" 
                      id="solo" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="solo"
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-turquoise-500 peer-data-[state=checked]:bg-turquoise-50 cursor-pointer transition-all"
                    >
                      <User className="mb-3 h-6 w-6" />
                      <p className="font-medium">Just Me</p>
                      <p className="text-sm text-muted-foreground">Solo traveler</p>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="couple" 
                      id="couple" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="couple"
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-turquoise-500 peer-data-[state=checked]:bg-turquoise-50 cursor-pointer transition-all"
                    >
                      <Heart className="mb-3 h-6 w-6" />
                      <p className="font-medium">Couple</p>
                      <p className="text-sm text-muted-foreground">2 travelers</p>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="family" 
                      id="family" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="family"
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-turquoise-500 peer-data-[state=checked]:bg-turquoise-50 cursor-pointer transition-all"
                    >
                      <Home className="mb-3 h-6 w-6" />
                      <p className="font-medium">Family</p>
                      <p className="text-sm text-muted-foreground">3+ travelers</p>
                    </Label>
                  </div>
                </RadioGroup>
                
                <Button 
                  onClick={moveToNextTab}
                  className="bg-turquoise-500 hover:bg-turquoise-600 text-white w-full mt-4"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dates" className="mt-6 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-center">When are you traveling?</h3>
                
                <div className="flex justify-center py-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full md:w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex justify-between gap-3">
                  <Button 
                    variant="outline" 
                    onClick={moveToPrevTab}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={moveToNextTab}
                    className="bg-turquoise-500 hover:bg-turquoise-600 text-white flex-1"
                    disabled={!date}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="mt-6 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-center">What's your budget?</h3>
                
                <div className="py-8 px-4">
                  <div className="mb-8">
                    <Label className="mb-6 block text-center text-sm text-muted-foreground">
                      Drag to adjust your budget preference
                    </Label>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      value={budget}
                      onValueChange={setBudget}
                      className="py-4"
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>Budget</span>
                      <span>Moderate</span>
                      <span>Premium</span>
                      <span>Luxury</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination">Where would you like to go?</Label>
                    <input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter destination (e.g., Paris, Thailand)"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-turquoise-400"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between gap-3">
                  <Button 
                    variant="outline" 
                    onClick={moveToPrevTab}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={moveToNextTab}
                    className="bg-turquoise-500 hover:bg-turquoise-600 text-white flex-1"
                    disabled={!destination}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="mt-6 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-center">Generate your AI Trip Plan</h3>
                
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-turquoise-100 rounded-full p-2">
                      <Bot className="h-5 w-5 text-turquoise-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">AI Generated Travel Plan</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Our AI will create a custom travel plan based on your preferences
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={handleGenerateAI}
                      className="w-full bg-turquoise-500 hover:bg-turquoise-600 text-white"
                      disabled={isGenerating || !destination}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>Generate AI Prompt</>
                      )}
                    </Button>
                  </div>
                </div>
                
                {prompt && (
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Your Custom Prompt:</h4>
                    <p className="text-sm text-gray-700">{prompt}</p>
                  </div>
                )}
                
                <div className="flex justify-between gap-3">
                  <Button 
                    variant="outline" 
                    onClick={moveToPrevTab}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateTrip}
                    className="bg-turquoise-500 hover:bg-turquoise-600 text-white flex-1"
                    disabled={!prompt}
                  >
                    Create Trip <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
