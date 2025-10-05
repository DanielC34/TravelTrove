import OpenAI from "openai";

// Check if API key is available
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey || apiKey === "your_openai_api_key_here") {
  console.warn(
    "⚠️  OpenAI API key not configured. AI features will be disabled."
  );
  console.warn(
    "💡 To enable AI features, add your OpenAI API key to the .env file"
  );
} else {
  console.log("✅ OpenAI API key configured successfully!");
}

const openai =
  apiKey && apiKey !== "your_openai_api_key_here"
    ? new OpenAI({ apiKey })
    : null;

export interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: {
    count: number;
    type: "solo" | "couple" | "family" | "group";
    details?: string;
  };
  budget: {
    amount: number;
    currency: string;
    type: "budget" | "moderate" | "premium" | "luxury";
  };
}

export interface ActivitySuggestion {
  name: string;
  description: string;
  category:
    | "attraction"
    | "restaurant"
    | "transport"
    | "accommodation"
    | "activity"
    | "other";
  estimatedCost: {
    amount: number;
    currency: string;
  };
  duration: number;
  priority: "must-see" | "recommended" | "optional";
}

// Fallback mock data for testing when OpenAI is not available
const generateMockItinerary = (tripData: TripData) => {
  const { destination, startDate, endDate, travelers, budget } = tripData;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  const mockDays = [];
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    mockDays.push({
      date: currentDate.toISOString().split('T')[0],
      dayNumber: i + 1,
      activities: [
        {
          name: `Morning Activity in ${destination}`,
          description: `Explore the highlights of ${destination}`,
          location: {
            name: `${destination} City Center`,
            address: `Main Street, ${destination}`
          },
          startTime: "09:00",
          endTime: "11:00",
          duration: 120,
          category: "attraction",
          cost: {
            amount: budget.type === 'budget' ? 15 : budget.type === 'luxury' ? 50 : 25,
            currency: budget.currency
          },
          notes: "Perfect for morning exploration",
          isFlexible: true,
          priority: "must-see"
        },
        {
          name: `Local Restaurant Experience`,
          description: `Taste authentic ${destination} cuisine`,
          location: {
            name: `Traditional ${destination} Restaurant`,
            address: `Food District, ${destination}`
          },
          startTime: "12:00",
          endTime: "13:30",
          duration: 90,
          category: "restaurant",
          cost: {
            amount: budget.type === 'budget' ? 20 : budget.type === 'luxury' ? 80 : 40,
            currency: budget.currency
          },
          notes: "Highly recommended by locals",
          isFlexible: false,
          priority: "recommended"
        },
        {
          name: `Afternoon ${destination} Adventure`,
          description: `Discover hidden gems and local culture`,
          location: {
            name: `${destination} Cultural District`,
            address: `Heritage Area, ${destination}`
          },
          startTime: "15:00",
          endTime: "17:00",
          duration: 120,
          category: "activity",
          cost: {
            amount: budget.type === 'budget' ? 10 : budget.type === 'luxury' ? 40 : 20,
            currency: budget.currency
          },
          notes: "Great for photos and cultural immersion",
          isFlexible: true,
          priority: "recommended"
        }
      ],
      notes: `Day ${i + 1} in ${destination} - A perfect mix of culture, food, and exploration`,
      weather: {
        forecast: "Partly Cloudy",
        temperature: 22,
        conditions: "Pleasant weather for sightseeing"
      }
    });
  }
  
  const totalCost = mockDays.reduce((total, day) => {
    return total + day.activities.reduce((dayTotal, activity) => {
      return dayTotal + (activity.cost?.amount || 0);
    }, 0);
  }, 0);
  
  return {
    name: `${days}-Day ${destination} Adventure`,
    description: `A carefully crafted ${days}-day itinerary for ${travelers.count} ${travelers.type} traveler(s) exploring the best of ${destination}`,
    days: mockDays,
    totalCost: {
      amount: totalCost,
      currency: budget.currency
    }
  };
};

export const openaiService = {
  async generateItinerary(tripData: TripData) {
    try {
      if (!openai) {
        console.log("🤖 Using mock itinerary data (OpenAI not configured)");
        return generateMockItinerary(tripData);
      }

      const { destination, startDate, endDate, travelers, budget } = tripData;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}.

Travel Details:
- Duration: ${days} days
- Travelers: ${travelers.count} ${travelers.type} traveler(s)
- Budget: ${budget.type} ($${budget.amount} ${budget.currency})
- Travel dates: ${startDate} to ${endDate}

Please create a JSON response with the following structure:
{
  "name": "Trip Name",
  "description": "Brief trip description",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "dayNumber": 1,
      "activities": [
        {
          "name": "Activity name",
          "description": "Brief description",
          "location": {
            "name": "Location name",
            "address": "Full address if available"
          },
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "duration": 120,
          "category": "attraction|restaurant|transport|accommodation|activity|other",
          "cost": {
            "amount": 25,
            "currency": "USD"
          },
          "notes": "Additional notes",
          "isFlexible": true,
          "priority": "must-see|recommended|optional"
        }
      ],
      "notes": "Day summary notes",
      "weather": {
        "forecast": "Sunny/Cloudy/Rainy",
        "temperature": 22,
        "conditions": "Clear skies"
      }
    }
  ],
  "totalCost": {
    "amount": 1500,
    "currency": "USD"
  }
}

Guidelines:
- Include 3-5 activities per day
- Mix attractions, restaurants, and activities
- Consider the budget level (budget/moderate/premium/luxury)
- Include realistic costs
- Add weather information for each day
- Make activities appropriate for the traveler type
- Include must-see attractions and local recommendations
- Ensure activities are geographically logical
- Add helpful notes and tips`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional travel planner with deep knowledge of destinations worldwide. Create detailed, practical itineraries that consider budget, traveler preferences, and local insights.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from OpenAI");
      }

      // Try to parse the JSON response
      try {
        const itineraryData = JSON.parse(response);
        return itineraryData;
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", response);
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to generate itinerary with AI");
    }
  },

  async getActivitySuggestions(
    destination: string,
    interests?: string[],
    budget?: { amount: number; currency: string }
  ) {
    try {
      if (!openai) {
        throw new Error(
          "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables."
        );
      }

      const prompt = `Suggest 8-10 activities for ${destination}.

${interests ? `Interests: ${interests.join(", ")}` : ""}
${budget ? `Budget: $${budget.amount} ${budget.currency}` : ""}

Please provide a JSON response with the following structure:
{
  "suggestions": [
    {
      "name": "Activity name",
      "description": "Brief description",
      "category": "attraction|restaurant|transport|accommodation|activity|other",
      "estimatedCost": {
        "amount": 25,
        "currency": "USD"
      },
      "duration": 120,
      "priority": "must-see|recommended|optional"
    }
  ]
}

Include a mix of:
- Must-see attractions
- Local restaurants and food experiences
- Cultural activities
- Outdoor activities
- Shopping and entertainment
- Transportation options
- Accommodation recommendations

Consider the destination's unique features and popular attractions.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a travel expert with deep knowledge of destinations worldwide. Provide practical, diverse activity suggestions that match traveler interests and budget.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from OpenAI");
      }

      try {
        const suggestionsData = JSON.parse(response);
        return suggestionsData;
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", response);
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to get activity suggestions");
    }
  },

  async getTravelRecommendations(
    destination: string,
    tripType: string,
    budget: string
  ) {
    try {
      if (!openai) {
        throw new Error(
          "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables."
        );
      }

      const prompt = `Provide travel recommendations for ${destination}.

Trip Type: ${tripType}
Budget Level: ${budget}

Please provide a JSON response with the following structure:
{
  "recommendations": {
    "bestTimeToVisit": "When to visit",
    "weather": "Typical weather conditions",
    "transportation": "Getting around tips",
    "accommodation": "Where to stay recommendations",
    "food": "Local cuisine highlights",
    "safety": "Safety tips",
    "budget": "Budget considerations",
    "packing": "What to pack",
    "tips": ["Tip 1", "Tip 2", "Tip 3"]
  }
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a travel expert providing practical advice for destinations worldwide.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from OpenAI");
      }

      try {
        const recommendationsData = JSON.parse(response);
        return recommendationsData;
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", response);
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to get travel recommendations");
    }
  },
};
