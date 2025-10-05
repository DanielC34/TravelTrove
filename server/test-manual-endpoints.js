// Manual testing script for places endpoints
const axios = require("axios");

const BASE_URL = "http://localhost:3001";

// You'll need to replace these with actual credentials
const TEST_CREDENTIALS = {
  email: "test@example.com", // Replace with your test user email
  password: "password123", // Replace with your test user password
};

let authToken = null;

async function login() {
  try {
    console.log("🔐 Logging in...");
    const response = await axios.post(
      `${BASE_URL}/api/auth/login`,
      TEST_CREDENTIALS
    );
    authToken = response.data.data.token;
    console.log("✅ Login successful!");
    return authToken;
  } catch (error) {
    console.log(
      "❌ Login failed:",
      error.response?.data?.error?.message || error.message
    );
    console.log(
      "💡 Make sure you have a test user account or register one first"
    );
    return null;
  }
}

async function testPlacesSearch() {
  try {
    console.log("\n🔍 Testing Places Search...");
    const response = await axios.get(
      `${BASE_URL}/api/places/search?q=paris&limit=3`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("✅ Search successful!");
    console.log("📊 Results count:", response.data.data.results.length);
    console.log("📍 First result:", response.data.data.results[0]?.name);
    console.log("🆔 First result ID:", response.data.data.results[0]?.id);

    return response.data.data.results[0]?.id;
  } catch (error) {
    console.log(
      "❌ Search failed:",
      error.response?.data?.error?.message || error.message
    );
    return null;
  }
}

async function testPlaceDetails(placeId) {
  try {
    console.log("\n📍 Testing Place Details...");
    const response = await axios.get(`${BASE_URL}/api/places/${placeId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log("✅ Details successful!");
    console.log("📍 Place name:", response.data.data.name);
    console.log("📍 Address:", response.data.data.address);
    console.log("📍 Coordinates:", response.data.data.coordinates);
    console.log("📍 Category:", response.data.data.category || "N/A");
    console.log("📍 Country:", response.data.data.country || "N/A");
    console.log("📍 Website:", response.data.data.website || "N/A");
    console.log("📍 Phone:", response.data.data.phone || "N/A");
  } catch (error) {
    console.log(
      "❌ Details failed:",
      error.response?.data?.error?.message || error.message
    );
  }
}

async function runTests() {
  console.log("🧪 Manual Testing Script for Places Endpoints\n");

  // Step 1: Login
  const token = await login();
  if (!token) {
    console.log("\n❌ Cannot proceed without authentication");
    console.log("💡 Please:");
    console.log("   1. Make sure you have a test user account");
    console.log("   2. Update TEST_CREDENTIALS in this script");
    console.log("   3. Or register a new user first");
    return;
  }

  // Step 2: Test search
  const placeId = await testPlacesSearch();
  if (!placeId) {
    console.log("\n❌ Cannot test place details without a valid place ID");
    return;
  }

  // Step 3: Test details
  await testPlaceDetails(placeId);

  console.log("\n🎉 Manual testing completed!");
  console.log("\n📋 Summary:");
  console.log("   ✅ Places Search: GET /api/places/search?q=paris&limit=3");
  console.log("   ✅ Place Details: GET /api/places/{place_id}");
  console.log("\n💡 You can now test these endpoints manually using:");
  console.log("   - Browser Developer Tools");
  console.log("   - Postman/Insomnia");
  console.log("   - curl commands");
  console.log(`   - Authorization Header: Bearer ${authToken}`);
}

// Run the tests
runTests();
