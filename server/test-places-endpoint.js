// Simple test script to verify the places search endpoint
const axios = require("axios");

const BASE_URL = "http://localhost:3001";

async function testPlacesEndpoint() {
  try {
    console.log("🧪 Testing Places Search Endpoint (OSM/Nominatim)...\n");

    // Test 1: Basic search
    console.log('1. Testing basic search for "paris"...');
    const response1 = await axios.get(
      `${BASE_URL}/api/places/search?q=paris&limit=3`
    );
    console.log("✅ Status:", response1.status);
    console.log("📊 Results count:", response1.data.data.results.length);
    console.log(
      "📍 First result:",
      response1.data.data.results[0]?.name || "No results"
    );
    console.log("");

    // Test 2: Search with different location
    console.log('2. Testing search for "tokyo"...');
    const response2 = await axios.get(
      `${BASE_URL}/api/places/search?q=tokyo&limit=2`
    );
    console.log("✅ Status:", response2.status);
    console.log("📊 Results count:", response2.data.data.results.length);
    console.log(
      "📍 First result:",
      response2.data.data.results[0]?.name || "No results"
    );
    console.log("");

    // Test 3: Invalid query (should return error)
    console.log("3. Testing invalid query (no q parameter)...");
    try {
      await axios.get(`${BASE_URL}/api/places/search`);
      console.log("❌ Expected error but got success");
    } catch (error) {
      console.log(
        "✅ Expected error received:",
        error.response?.status || "Network error"
      );
    }
    console.log("");

    // Test 4: Place details endpoint
    console.log("4. Testing place details endpoint...");
    try {
      // First get a place ID from search
      const searchResponse = await axios.get(
        `${BASE_URL}/api/places/search?q=paris&limit=1`
      );

      if (searchResponse.data.data.results.length > 0) {
        const placeId = searchResponse.data.data.results[0].id;
        const detailsResponse = await axios.get(
          `${BASE_URL}/api/places/${placeId}`
        );
        console.log("✅ Place details status:", detailsResponse.status);
        console.log("📍 Place name:", detailsResponse.data.data.name);
        console.log("📍 Place address:", detailsResponse.data.data.address);
      } else {
        console.log("⚠️  No search results to test place details");
      }
    } catch (error) {
      console.log(
        "❌ Place details test failed:",
        error.response?.status || error.message
      );
    }
    console.log("");

    console.log("🎉 All tests completed!");
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Server is not running. Please start the server first:");
      console.log("   cd server && npm run dev");
    } else {
      console.log("❌ Test failed:", error.message);
      if (error.response) {
        console.log("   Status:", error.response.status);
        console.log("   Data:", error.response.data);
      }
    }
  }
}

// Run the test
testPlacesEndpoint();
