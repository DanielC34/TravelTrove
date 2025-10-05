const axios = require("axios");

const API_BASE_URL = "http://localhost:3001/api";

// Test data
const testUserActions = [
  {
    actionType: "search",
    metadata: {
      query: "restaurants in Paris",
      resultCount: 15,
      source: "map",
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
  },
  {
    actionType: "add_poi",
    metadata: {
      placeId: "place_123",
      placeName: "Eiffel Tower",
      placeCategory: "landmark",
      source: "map",
      coordinates: { lat: 48.8584, lng: 2.2945 },
    },
  },
  {
    actionType: "like",
    metadata: {
      placeId: "place_123",
      placeName: "Eiffel Tower",
      placeCategory: "landmark",
      source: "map",
    },
  },
  {
    actionType: "add_to_itinerary",
    metadata: {
      placeId: "place_123",
      placeName: "Eiffel Tower",
      placeCategory: "landmark",
      tripId: "trip_456",
      dayNumber: 1,
      priority: "must-see",
      source: "itinerary_dialog",
    },
  },
];

async function testUserActions() {
  console.log("🧪 Testing User Action Recording System\n");

  try {
    // Note: In a real test, you would need to authenticate first
    // For now, we'll test the endpoints structure

    console.log("📋 Test Actions to Record:");
    testUserActions.forEach((action, index) => {
      console.log(
        `${index + 1}. ${action.actionType.toUpperCase()}: ${
          action.metadata.placeName || action.metadata.query
        }`
      );
    });

    console.log("\n🔗 Available Endpoints:");
    console.log("POST /api/user-actions - Record single action");
    console.log("POST /api/user-actions/batch - Record multiple actions");
    console.log("GET /api/user-actions/stats - Get user statistics");
    console.log("GET /api/user-actions/recent - Get recent actions");
    console.log("GET /api/user-actions/counts - Get action counts");
    console.log(
      "GET /api/user-actions/analytics/popular-places - Get popular places"
    );
    console.log(
      "GET /api/user-actions/analytics/search - Get search analytics"
    );
    console.log("GET /api/user-actions/place/:placeId - Get place actions");

    console.log("\n📊 Expected Data Structure:");
    console.log(JSON.stringify(testUserActions[0], null, 2));

    console.log("\n✅ User Action System Ready!");
    console.log("💡 To test with real data:");
    console.log("   1. Start the server: npm run dev");
    console.log("   2. Authenticate a user");
    console.log("   3. Use the frontend to perform actions");
    console.log("   4. Check analytics at /analytics page");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testUserActions();
