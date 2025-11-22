import supabase from "./index.js";

/* =========================================================
   USERS / AUTH
========================================================= */

// SIGN UP — using Supabase Auth + users table insertion
export async function signUp(email, password, name) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) throw authError;

  // Insert profile in users table - let Supabase auto-generate the ID
  const { data: userData, error } = await supabase
    .from("users")
    .insert({
      email,
      name,
    })
    .select()
    .single();
  
  if (error) throw error;

  // Return both auth user and database user ID
  return {
    ...authData.user,
    db_user_id: userData.id
  };
}

// LOGIN
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

// GET AUTH USER
export async function getUserById(user_id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();
  if (error) throw error;
  return data;
}

/* =========================================================
   LOCATIONS
========================================================= */

// ADD LOCATION
export async function addLocation({ latitude, longitude, halal = false, crowded = false, hotspot = false }) {
  const { data, error } = await supabase
    .from("locations")
    .insert({
      latitude,
      longitude,
      halal,
      crowded,
      hotspot,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// FIND LOCATION BY COORDINATE
export async function findLocation(latitude, longitude) {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("latitude", latitude)
    .eq("longitude", longitude)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/* =========================================================
   POSTS / REVIEWS
========================================================= */

// ADD REVIEW (creates location if needed)
export async function addReview({
  user_id,
  description,
  image_url,
  rating,
  latitude,
  longitude,
}) {
  // 1. Try to find the location
  let location = await findLocation(latitude, longitude);

  // 2. Create location if not found
  if (!location) {
    location = await addLocation({ latitude, longitude });
  }

  // 3. Add post with location ID
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id,
      description,
      image_url,
      rating,
      location_id: location.id,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// GET PAGINATED POSTS
export async function getPosts(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      created_at,
      description,
      image_url,
      rating,
      likes,
      user:users(id, name, image_id),
      location:locations(id, latitude, longitude)
    `
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return data;
}

/* =========================================================
   FRIENDSHIPS
========================================================= */

// ADD FRIEND
export async function addFriend(user_id, friend_id) {
  const { data, error } = await supabase
    .from("friendships")
    .insert({
      user_id,
      friend_id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// REMOVE FRIEND
export async function removeFriend(user_id, friend_id) {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("user_id", user_id)
    .eq("friend_id", friend_id);

  if (error) throw error;
  return true;
}

// GET FRIENDS (paginated)
export async function getFriends(user_id, page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
      friend_id,
      friend:users!friendships_friend_id_fkey(id, name, image_id)
    `
    )
    .eq("user_id", user_id)
    .range(from, to);

  if (error) throw error;
  return data;
}

/* =========================================================
   HOTTEST LOCATIONS
========================================================= */

export async function getHottestLocations(limit = 10) {
  // Get posts with location info, then count in JS
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      location_id,
      locations(id, latitude, longitude)
    `
    );

  if (error) throw error;

  // Count posts per location
  const locationCounts = {};
  data.forEach(post => {
    if (post.location_id) {
      if (!locationCounts[post.location_id]) {
        locationCounts[post.location_id] = {
          location: post.locations,
          count: 0
        };
      }
      locationCounts[post.location_id].count++;
    }
  });

  // Convert to array and sort
  const sorted = Object.values(locationCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sorted;
}