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
  getUserById
} from "./queries.js";

async function runTests() {
  let newUser = null;
  let secondUser = null;

  try {
    console.log("========== SIGN UP USER 1 ==========");
    const timestamp = Date.now();
    newUser = await signUp(
      `testuser${timestamp}@mail.com`,
      "password123",
      "Test User"
    );
    console.log("✓ SignUp Response:", newUser);
    console.log("✓ Database User ID:", newUser.db_user_id);

    console.log("\n========== SIGN UP USER 2 (for friend test) ==========");
    secondUser = await signUp(
      `testuser${timestamp + 1}@mail.com`,
      "password123",
      "Test Friend"
    );
    console.log("✓ SignUp Response:", secondUser);

    console.log("\n========== LOGIN ==========");
    const loginRes = await login(`testuser${timestamp}@mail.com`, "password123");
    console.log("✓ Login Response:", loginRes);

    console.log("\n========== GET USER ==========");
    const userRecord = await getUserById(newUser.db_user_id);
    console.log("✓ User Table Record:", userRecord);

    console.log("\n========== ADD LOCATION ==========");
    const location = await addLocation({
      latitude: "51.505",
      longitude: "-0.09",
      halal: false,
      crowded: false,
      hotspot: false,
    });
    console.log("✓ Location Response:", location);

    console.log("\n========== FIND LOCATION ==========");
    const found = await findLocation("51.505", "-0.09");
    console.log("✓ Found:", found);

    console.log("\n========== ADD REVIEW (new location) ==========");
    const review = await addReview({
      user_id: newUser.db_user_id,
      description: "This place is amazing!",
      image_url: null,
      rating: 5,
      latitude: "40.7128",
      longitude: "-74.0060",
    });
    console.log("✓ Review Response:", review);

    console.log("\n========== ADD ANOTHER REVIEW (same location) ==========");
    const review2 = await addReview({
      user_id: secondUser.db_user_id,
      description: "Great spot!",
      image_url: "https://example.com/image.jpg",
      rating: 4,
      latitude: "40.7128",
      longitude: "-74.0060",
    });
    console.log("✓ Review 2 Response:", review2);

    console.log("\n========== GET POSTS (page 1) ==========");
    const posts = await getPosts(1, 10);
    console.log("✓ Posts Response (count):", posts.length);
    console.log("✓ First Post:", posts[0]);

    console.log("\n========== ADD FRIEND ==========");
    const friendResult = await addFriend(newUser.db_user_id, secondUser.db_user_id);
    console.log("✓ AddFriend Response:", friendResult);

    console.log("\n========== GET FRIENDS ==========");
    const friends = await getFriends(newUser.db_user_id, 1, 10);
    console.log("✓ Friends List:", friends);

    console.log("\n========== HOTTEST LOCATIONS ==========");
    const hottest = await getHottestLocations(5);
    console.log("✓ Hottest Locations:", hottest);

    console.log("\n========== REMOVE FRIEND ==========");
    const removed = await removeFriend(newUser.db_user_id, secondUser.db_user_id);
    console.log("✓ RemoveFriend Response:", removed);

    console.log("\n✅ ALL TESTS COMPLETED SUCCESSFULLY!");

  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    console.error("Full error:", err);
  }
}

runTests();