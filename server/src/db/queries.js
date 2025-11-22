import supabase from "./index.js";
import { getBoundingBox, filterLocationsByDistance } from "../utils/geoUtils.js";

/* =========================================================
   USERS / AUTH
========================================================= */

// SIGN UP — using Supabase Auth + users table insertion
export async function signUp(email, password, name) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) throw authError;

  const { data: userData, error } = await supabase
    .from("users")
    .insert({
      email,
      name,
    })
    .select()
    .single();
  
  if (error) throw error;

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
export async function addLocation({ 
  latitude, 
  longitude, 
  halal = false, 
  crowded = false, 
  hotspot = false,
  near_greenery = false  // NEW FIELD
}) {
  const { data, error } = await supabase
    .from("locations")
    .insert({
      latitude,
      longitude,
      halal,
      crowded,
      hotspot,
      near_greenery
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

// GET NEARBY HOTSPOT LOCATIONS (GREEN AREAS ONLY)
export async function getNearbyGreenHotspots(latitude, longitude, radiusKm = 5, limit = 20) {
  const bbox = getBoundingBox(latitude, longitude, radiusKm);
  
  // Query locations that are hotspots AND near greenery
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("hotspot", true)
    .eq("near_greenery", true)  // Filter for green areas only
    .gte("latitude", bbox.minLat.toString())
    .lte("latitude", bbox.maxLat.toString())
    .gte("longitude", bbox.minLon.toString())
    .lte("longitude", bbox.maxLon.toString());

  if (error) throw error;

  const nearbyLocations = filterLocationsByDistance(
    data,
    latitude,
    longitude,
    radiusKm
  );

  return nearbyLocations.slice(0, limit);
}

// GET NEARBY HOTSPOT LOCATIONS
export async function getNearbyHotspots(latitude, longitude, radiusKm = 5, limit = 20) {
  const bbox = getBoundingBox(latitude, longitude, radiusKm);
  
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("hotspot", true)
    .gte("latitude", bbox.minLat.toString())
    .lte("latitude", bbox.maxLat.toString())
    .gte("longitude", bbox.minLon.toString())
    .lte("longitude", bbox.maxLon.toString());

  if (error) throw error;

  const nearbyLocations = filterLocationsByDistance(
    data,
    latitude,
    longitude,
    radiusKm
  );

  return nearbyLocations.slice(0, limit);
}

// GET NEARBY LOCATIONS (all types, not just hotspots)
export async function getNearbyLocations(latitude, longitude, radiusKm = 5, limit = 20, filters = {}) {
  const bbox = getBoundingBox(latitude, longitude, radiusKm);
  
  let query = supabase
    .from("locations")
    .select("*")
    .gte("latitude", bbox.minLat.toString())
    .lte("latitude", bbox.maxLat.toString())
    .gte("longitude", bbox.minLon.toString())
    .lte("longitude", bbox.maxLon.toString());

  // Apply optional filters
  if (filters.near_greenery !== undefined) {
    query = query.eq("near_greenery", filters.near_greenery);
  }
  if (filters.halal !== undefined) {
    query = query.eq("halal", filters.halal);
  }
  if (filters.crowded !== undefined) {
    query = query.eq("crowded", filters.crowded);
  }
  if (filters.hotspot !== undefined) {
    query = query.eq("hotspot", filters.hotspot);
  }

  const { data, error } = await query;

  if (error) throw error;

  const nearbyLocations = filterLocationsByDistance(
    data,
    latitude,
    longitude,
    radiusKm
  );

  return nearbyLocations.slice(0, limit);
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
  let location = await findLocation(latitude, longitude);

  if (!location) {
    location = await addLocation({ latitude, longitude });
  }

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
      location:locations(id, latitude, longitude, near_greenery)
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
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      location_id,
      locations(id, latitude, longitude, near_greenery)
    `
    );

  if (error) throw error;

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

  const sorted = Object.values(locationCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sorted;
}