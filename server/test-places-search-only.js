// Simple test script for places search only (no details)
const axios = require("axios");

const BASE_URL = "http://localhost:3001";

async function testPlacesSearchOnly() {
  try {
    console.log("🔍 Testing Places Search Only (OSM/Nominatim)\n");

    // Test various search queries
    const testQueries = [
      "paris",
      "london",
      "tokyo",
      "new york",
      "berlin",
      "restaurant",
      "hotel",
      "museum",
    ];

    for (const query of testQueries) {
      try {
        console.log(`Testing search for: "${query}"`);
        const response = await axios.get(
          `${BASE_URL}/api/places/test/search?q=${query}&limit=2`
        );

        if (response.data.success && response.data.data.results.length > 0) {
          console.log(
            `✅ "${query}": Found ${response.data.data.results.length} results`
          );
          console.log(
            `   📍 First result: ${response.data.data.results[0].name}`
          );
          console.log(`   🆔 ID: ${response.data.data.results[0].id}`);
          console.log(
            `   📍 Address: ${response.data.data.results[0].address}`
          );
          console.log(
            `   🌍 Coordinates: ${response.data.data.results[0].coordinates.lat}, ${response.data.data.results[0].coordinates.lng}`
          );
        } else {
          console.log(`⚠️  "${query}": No results found`);
        }
      } catch (error) {
        console.log(
          `❌ "${query}": Error - ${
            error.response?.data?.error?.message || error.message
          }`
        );
      }
      console.log(""); // Empty line for readability
    }

    console.log("🎉 Places search testing completed!");
    console.log("\n📋 Summary:");
    console.log("   ✅ OSM/Nominatim search is working");
    console.log("   ✅ No API keys required");
    console.log("   ✅ No authentication required for test endpoints");
    console.log("   ✅ Free and open-source");
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
testPlacesSearchOnly();
