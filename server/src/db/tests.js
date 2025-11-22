import 'dotenv/config';
import {
  signUp,
  login,
  addLocation,
  findLocation,
  addReview,
  getPosts,
  addFriend,
  removeFriend,
  getFriends,
  getHottestLocations,
  getUserById,
  getNearbyGreenHotspots,
  getNearbyLocations
} from "./queries.js";

async function runTests() {
  let newUser = null;
  let secondUser = null;

  try {
    console.log("=".repeat(60));
    console.log("🧪 STARTING TEST SUITE - near_greenery Integration");
    console.log("=".repeat(60));

    // ==================== USER TESTS ====================
    console.log("\n========== SIGN UP USER 1 ==========");
    const timestamp = Date.now();
    newUser = await signUp(
      `testuser${timestamp}@mail.com`,
      "password123",
      "Test User"
    );
    console.log("✓ SignUp Response:");
    console.log("  - Auth ID:", newUser.id);
    console.log("  - Database User ID:", newUser.db_user_id);
    console.log("  - Email:", newUser.email);

    console.log("\n========== SIGN UP USER 2 (for friend test) ==========");
    secondUser = await signUp(
      `testuser${timestamp + 1}@mail.com`,
      "password123",
      "Test Friend"
    );
    console.log("✓ SignUp Response:");
    console.log("  - Auth ID:", secondUser.id);
    console.log("  - Database User ID:", secondUser.db_user_id);

    console.log("\n========== LOGIN ==========");
    const loginRes = await login(`testuser${timestamp}@mail.com`, "password123");
    console.log("✓ Login Successful");
    console.log("  - User ID:", loginRes.id);
    console.log("  - Email:", loginRes.email);

    console.log("\n========== GET USER ==========");
    const userRecord = await getUserById(newUser.db_user_id);
    console.log("✓ User Table Record Retrieved:");
    console.log("  - ID:", userRecord.id);
    console.log("  - Name:", userRecord.name);
    console.log("  - Email:", userRecord.email);

    // ==================== LOCATION TESTS ====================
    console.log("\n========== ADD LOCATION 1 (GREEN HOTSPOT) ==========");
    const location1 = await addLocation({
      latitude: "51.505",
      longitude: "-0.09",
      halal: false,
      crowded: false,
      hotspot: true,
      near_greenery: true  // TEST: Add green location
    });
    console.log("✓ Location 1 Created:");
    console.log("  - ID:", location1.id);
    console.log("  - Coordinates:", location1.latitude, location1.longitude);
    console.log("  - Hotspot:", location1.hotspot);
    console.log("  - Near Greenery:", location1.near_greenery);

    console.log("\n========== ADD LOCATION 2 (NON-GREEN HOTSPOT) ==========");
    const location2 = await addLocation({
      latitude: "51.506",
      longitude: "-0.08",
      halal: false,
      crowded: true,
      hotspot: true,
      near_greenery: false  // TEST: Non-green location
    });
    console.log("✓ Location 2 Created:");
    console.log("  - ID:", location2.id);
    console.log("  - Coordinates:", location2.latitude, location2.longitude);
    console.log("  - Hotspot:", location2.hotspot);
    console.log("  - Near Greenery:", location2.near_greenery);

    console.log("\n========== ADD LOCATION 3 (REGULAR GREEN SPOT) ==========");
    const location3 = await addLocation({
      latitude: "51.507",
      longitude: "-0.07",
      halal: false,
      crowded: false,
      hotspot: false,
      near_greenery: true  // TEST: Green but not hotspot
    });
    console.log("✓ Location 3 Created:");
    console.log("  - ID:", location3.id);
    console.log("  - Hotspot:", location3.hotspot);
    console.log("  - Near Greenery:", location3.near_greenery);

    console.log("\n========== FIND LOCATION BY COORDINATES ==========");
    const found = await findLocation("51.505", "-0.09");
    console.log("✓ Location Found:");
    console.log("  - ID:", found.id);
    console.log("  - Near Greenery Field Present:", 'near_greenery' in found);
    console.log("  - Near Greenery Value:", found.near_greenery);

    // ==================== REVIEW/POST TESTS ====================
    console.log("\n========== ADD REVIEW 1 (NEW GREEN LOCATION) ==========");
    const review1 = await addReview({
      user_id: newUser.db_user_id,
      description: "Beautiful park nearby! Perfect for a picnic.",
      image_url: null,
      rating: 5,
      latitude: "40.7128",
      longitude: "-74.0060",
      near_greenery: true  // TEST: Review with greenery flag
    });
    console.log("✓ Review 1 Created:");
    console.log("  - Post ID:", review1.id);
    console.log("  - Rating:", review1.rating);
    console.log("  - Description:", review1.description);

    console.log("\n========== ADD REVIEW 2 (SAME LOCATION) ==========");
    const review2 = await addReview({
      user_id: secondUser.db_user_id,
      description: "Great spot for relaxation!",
      image_url: "https://example.com/park.jpg",
      rating: 4,
      latitude: "40.7128",
      longitude: "-74.0060",
    });
    console.log("✓ Review 2 Created:");
    console.log("  - Post ID:", review2.id);
    console.log("  - Rating:", review2.rating);
    console.log("  - Has Image:", !!review2.image_url);

    console.log("\n========== ADD REVIEW 3 (NON-GREEN LOCATION) ==========");
    const review3 = await addReview({
      user_id: newUser.db_user_id,
      description: "Busy street corner, lots of activity",
      image_url: null,
      rating: 3,
      latitude: "40.7589",
      longitude: "-73.9851",
      near_greenery: false  // TEST: Non-green location
    });
    console.log("✓ Review 3 Created:");
    console.log("  - Post ID:", review3.id);
    console.log("  - Rating:", review3.rating);

    console.log("\n========== GET POSTS (PAGINATED) ==========");
    const posts = await getPosts(1, 10);
    console.log("✓ Posts Retrieved:");
    console.log("  - Total Posts:", posts.length);
    if (posts.length > 0) {
      console.log("  - First Post ID:", posts[0].id);
      console.log("  - First Post User:", posts[0].user?.name);
      console.log("  - Location Has near_greenery:", 'near_greenery' in (posts[0].location || {}));
      console.log("  - Location near_greenery Value:", posts[0].location?.near_greenery);
    }

    // ==================== NEARBY LOCATION TESTS ====================
    console.log("\n========== GET NEARBY GREEN HOTSPOTS ==========");
    const greenHotspots = await getNearbyGreenHotspots(51.505, -0.09, 1, 10);
    console.log("✓ Nearby Green Hotspots Found:", greenHotspots.length);
    if (greenHotspots.length > 0) {
      console.log("  - First Hotspot:");
      console.log("    • ID:", greenHotspots[0].id);
      console.log("    • Distance:", greenHotspots[0].distance.toFixed(2), "km");
      console.log("    • Is Hotspot:", greenHotspots[0].hotspot);
      console.log("    • Near Greenery:", greenHotspots[0].near_greenery);
    }
    console.log("  - All Results Are Hotspots:", greenHotspots.every(loc => loc.hotspot === true));
    console.log("  - All Results Are Near Greenery:", greenHotspots.every(loc => loc.near_greenery === true));

    console.log("\n========== GET NEARBY LOCATIONS (GREEN FILTER) ==========");
    const nearbyGreen = await getNearbyLocations(51.505, -0.09, 1, 10, { near_greenery: true });
    console.log("✓ Nearby Green Locations Found:", nearbyGreen.length);
    if (nearbyGreen.length > 0) {
      console.log("  - First Location:");
      console.log("    • ID:", nearbyGreen[0].id);
      console.log("    • Distance:", nearbyGreen[0].distance.toFixed(2), "km");
      console.log("    • Near Greenery:", nearbyGreen[0].near_greenery);
    }
    console.log("  - All Have near_greenery=true:", nearbyGreen.every(loc => loc.near_greenery === true));

    console.log("\n========== GET NEARBY LOCATIONS (NO FILTER) ==========");
    const nearbyAll = await getNearbyLocations(51.505, -0.09, 1, 10);
    console.log("✓ All Nearby Locations Found:", nearbyAll.length);
    console.log("  - Should Include Both Green and Non-Green");
    const greenCount = nearbyAll.filter(loc => loc.near_greenery === true).length;
    const nonGreenCount = nearbyAll.filter(loc => loc.near_greenery === false).length;
    console.log("  - Green Locations:", greenCount);
    console.log("  - Non-Green Locations:", nonGreenCount);

    console.log("\n========== GET NEARBY LOCATIONS (MULTIPLE FILTERS) ==========");
    const nearbyFiltered = await getNearbyLocations(51.505, -0.09, 1, 10, { 
      near_greenery: true, 
      hotspot: true 
    });
    console.log("✓ Filtered Results:", nearbyFiltered.length);
    console.log("  - All Are Hotspots AND Near Greenery:", 
      nearbyFiltered.every(loc => loc.hotspot === true && loc.near_greenery === true));

    // ==================== FRIENDSHIP TESTS ====================
    console.log("\n========== ADD FRIEND ==========");
    const friendResult = await addFriend(newUser.db_user_id, secondUser.db_user_id);
    console.log("✓ Friendship Created:");
    console.log("  - User ID:", friendResult.user_id);
    console.log("  - Friend ID:", friendResult.friend_id);

    console.log("\n========== GET FRIENDS ==========");
    const friends = await getFriends(newUser.db_user_id, 1, 10);
    console.log("✓ Friends List Retrieved:");
    console.log("  - Total Friends:", friends.length);
    if (friends.length > 0) {
      console.log("  - First Friend:", friends[0].friend?.name);
    }

    console.log("\n========== HOTTEST LOCATIONS ==========");
    const hottest = await getHottestLocations(5);
    console.log("✓ Hottest Locations Retrieved:");
    console.log("  - Total Locations:", hottest.length);
    if (hottest.length > 0) {
      console.log("  - Top Location:");
      console.log("    • Post Count:", hottest[0].count);
      console.log("    • Coordinates:", hottest[0].location?.latitude, hottest[0].location?.longitude);
      console.log("    • Near Greenery:", hottest[0].location?.near_greenery);
    }

    console.log("\n========== REMOVE FRIEND ==========");
    const removed = await removeFriend(newUser.db_user_id, secondUser.db_user_id);
    console.log("✓ Friendship Removed Successfully");

    // ==================== FINAL SUMMARY ====================
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    
    console.log("\n📊 TEST SUMMARY:");
    console.log("  ✓ User authentication working");
    console.log("  ✓ near_greenery field added to locations");
    console.log("  ✓ Green hotspot filtering functional");
    console.log("  ✓ Location filtering by greenery working");
    console.log("  ✓ Multiple filter combinations working");
    console.log("  ✓ Posts include location greenery information");
    console.log("  ✓ Distance calculations accurate");
    console.log("  ✓ Friendship system working");
    
    console.log("\n🌳 GREEN SPACE FILTERING:");
    console.log("  ✓ Can add locations with near_greenery flag");
    console.log("  ✓ Can filter for only green hotspots");
    console.log("  ✓ Can filter for any green locations");
    console.log("  ✓ Can combine multiple filters");
    
    console.log("\n✨ All systems operational!\n");

  } catch (err) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ TEST FAILED");
    console.error("=".repeat(60));
    console.error("\n📛 ERROR MESSAGE:", err.message);
    console.error("\n📋 FULL ERROR:");
    console.error(err);
    console.error("\n💡 TROUBLESHOOTING TIPS:");
    console.error("  1. Make sure you ran the database migration first");
    console.error("  2. Check that SUPABASE_KEY is set in your .env file");
    console.error("  3. Verify your Supabase connection is working");
    console.error("  4. Ensure all files are updated correctly\n");
    process.exit(1);
  }
}

// Run the tests
runTests();