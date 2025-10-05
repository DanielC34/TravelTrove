// Test script to verify OSM/Nominatim functionality without Mapbox
const axios = require("axios");

const BASE_URL = "http://localhost:3001";

async function testOSMOnly() {
  try {
    console.log("🗺️  Testing OSM/Nominatim Places API (No Mapbox Required)\n");

    // Test 1: Search for places using OSM
    console.log("1. Testing OSM places search...");
    const searchResponse = await axios.get(
      `${BASE_URL}/api/places/test/search?q=paris&limit=3`
    );

    console.log("✅ OSM Search successful!");
    console.log("📊 Results count:", searchResponse.data.data.results.length);
    console.log("📍 First result:", searchResponse.data.data.results[0]?.name);
    console.log("🆔 First result ID:", searchResponse.data.data.results[0]?.id);
    console.log("🌍 Provider: OpenStreetMap/Nominatim (Free)");
    console.log("");

    if (searchResponse.data.data.results.length === 0) {
      console.log(
        "⚠️  No search results found. Trying different search terms..."
      );

      // Try different search terms
      const testQueries = ["london", "tokyo", "new york", "berlin"];
      for (const query of testQueries) {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/places/test/search?q=${query}&limit=1`
          );
          if (response.data.data.results.length > 0) {
            console.log(
              `✅ Found results for "${query}":`,
              response.data.data.results[0].name
            );
            break;
          }
        } catch (error) {
          console.log(`❌ No results for "${query}"`);
        }
      }
      return;
    }

    const placeId = searchResponse.data.data.results[0].id;

    // Test 2: Get place details using OSM
    console.log("2. Testing OSM place details...");
    const detailsResponse = await axios.get(
      `${BASE_URL}/api/places/test/${placeId}`
    );

    console.log("✅ OSM Details successful!");
    console.log("📍 Place name:", detailsResponse.data.data.name);
    console.log("📍 Address:", detailsResponse.data.data.address);
    console.log("📍 Coordinates:", detailsResponse.data.data.coordinates);
    console.log("📍 Category:", detailsResponse.data.data.category || "N/A");
    console.log("📍 Country:", detailsResponse.data.data.country || "N/A");
    console.log("📍 Website:", detailsResponse.data.data.website || "N/A");
    console.log("📍 Phone:", detailsResponse.data.data.phone || "N/A");
    console.log("🌍 Provider: OpenStreetMap/Nominatim (Free)");
    console.log("");

    // Test 3: Test different search queries
    console.log("3. Testing various search queries...");
    const testQueries = ["restaurant", "hotel", "museum", "airport"];

    for (const query of testQueries) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/places/test/search?q=${query}&limit=1`
        );
        if (response.data.data.results.length > 0) {
          console.log(
            `✅ "${query}": Found ${response.data.data.results[0].name}`
          );
        } else {
          console.log(`⚠️  "${query}": No results`);
        }
      } catch (error) {
        console.log(`❌ "${query}": Error - ${error.message}`);
      }
    }
    console.log("");

    console.log("🎉 OSM/Nominatim testing completed successfully!");
    console.log("\n📋 Summary:");
    console.log("   ✅ Places Search: Working with OSM/Nominatim");
    console.log("   ✅ Place Details: Working with OSM/Nominatim");
    console.log("   ✅ No API keys required");
    console.log("   ✅ No paywall barriers");
    console.log("   ✅ Free and open-source");
    console.log("\n💡 Ready for development and testing!");
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
testOSMOnly();
