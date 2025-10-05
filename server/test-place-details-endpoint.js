// Test script to verify the place details endpoint
const axios = require("axios");

const BASE_URL = "http://localhost:3001";

async function testPlaceDetailsEndpoint() {
  try {
    console.log("🧪 Testing Place Details Endpoint (OSM/Nominatim)...\n");

    // First, let's search for a place to get a valid ID
    console.log("1. Searching for a place to get a valid ID...");
    const searchResponse = await axios.get(
      `${BASE_URL}/api/places/search?q=paris&limit=1`
    );

    if (searchResponse.data.data.results.length === 0) {
      console.log("❌ No search results found. Cannot test place details.");
      return;
    }

    const placeId = searchResponse.data.data.results[0].id;
    console.log(`✅ Found place ID: ${placeId}`);
    console.log(`📍 Place name: ${searchResponse.data.data.results[0].name}`);
    console.log("");

    // Test 2: Get place details
    console.log("2. Testing place details endpoint...");
    const detailsResponse = await axios.get(
      `${BASE_URL}/api/places/${placeId}`
    );
    console.log("✅ Status:", detailsResponse.status);
    console.log("📊 Place details:");
    console.log("   - Name:", detailsResponse.data.data.name);
    console.log("   - Address:", detailsResponse.data.data.address);
    console.log("   - Coordinates:", detailsResponse.data.data.coordinates);
    console.log("   - Category:", detailsResponse.data.data.category || "N/A");
    console.log("   - Country:", detailsResponse.data.data.country || "N/A");
    console.log("   - Region:", detailsResponse.data.data.region || "N/A");
    console.log(
      "   - Description:",
      detailsResponse.data.data.description || "N/A"
    );
    console.log("   - Website:", detailsResponse.data.data.website || "N/A");
    console.log("   - Phone:", detailsResponse.data.data.phone || "N/A");
    console.log("");

    // Test 3: Invalid place ID (should return error)
    console.log("3. Testing invalid place ID...");
    try {
      await axios.get(`${BASE_URL}/api/places/invalid-id-12345`);
      console.log("❌ Expected error but got success");
    } catch (error) {
      console.log(
        "✅ Expected error received:",
        error.response?.status || "Network error"
      );
      if (error.response?.data) {
        console.log("   Error message:", error.response.data.error?.message);
      }
    }
    console.log("");

    // Test 4: Missing place ID (should return error)
    console.log("4. Testing missing place ID...");
    try {
      await axios.get(`${BASE_URL}/api/places/`);
      console.log("❌ Expected error but got success");
    } catch (error) {
      console.log(
        "✅ Expected error received:",
        error.response?.status || "Network error"
      );
    }
    console.log("");

    console.log("🎉 All place details tests completed!");
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
testPlaceDetailsEndpoint();
