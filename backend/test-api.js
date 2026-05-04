const axios = require("axios");
const BASE_URL = "http://localhost:5000/api";

async function testAPI() {
  console.log("🔍 Testing API endpoints...\n");

  // 1. Health check
  try {
    const res = await axios.get("http://localhost:5000");
    console.log("✅ Root endpoint:", res.status, res.data.status);
  } catch (e) {
    console.error("❌ Root endpoint failed", e.message);
  }

  // 2. Players
  try {
    const res = await axios.get(`${BASE_URL}/players`);
    console.log(`✅ GET /players: ${res.data.length} players`);
  } catch (e) {
    console.error("❌ GET /players failed", e.message);
  }

  // 3. Standings
  try {
    const res = await axios.get(`${BASE_URL}/standings`);
    console.log(`✅ GET /standings: ${res.data.length} teams`);
  } catch (e) {
    console.error("❌ GET /standings failed", e.message);
  }

  // 4. Gallery
  try {
    const res = await axios.get(`${BASE_URL}/gallery`);
    console.log(`✅ GET /gallery: ${res.data.data?.length || 0} images`);
  } catch (e) {
    console.error("❌ GET /gallery failed", e.message);
  }

  // 5. Stats
  try {
    const res = await axios.get(`${BASE_URL}/stats`);
    console.log(`✅ GET /stats: ${res.data.players?.total} players total`);
  } catch (e) {
    console.error("❌ GET /stats failed", e.message);
  }

  console.log("\n🎉 API tests completed.");
}

testAPI();
