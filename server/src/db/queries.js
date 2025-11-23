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

/* =========================================================
   EVENTS
========================================================= */
// ADD EVENT
export async function addEvent({
  user_id,
  location_id,
  name,
  event_date,
  event_time,
  description = null,
  latitude,
  longitude
}) {
  let finalLocationId = location_id;

  if (!finalLocationId && latitude && longitude) {
    let location = await findLocation(latitude, longitude);
    if (!location) {
      location = await addLocation({ latitude, longitude });
    }
    finalLocationId = location.id;
  }

  if (!finalLocationId) {
    throw new Error('Either location_id or latitude/longitude must be provided');
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      host_user_id: user_id,
      location_id: finalLocationId,
      name,
      event_date,
      event_time,
      description,
      is_active: true,
      participants: []
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// GET EVENT BY ID
export async function getEventById(event_id) {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      created_at,
      name,
      event_date,
      event_time,
      description,
      is_active,
      participants,
      host_user:users!events_host_user_id_fkey(id, name, image_id),
      location:locations(id, latitude, longitude)
    `
    )
    .eq("id", event_id)
    .single();

  if (error) throw error;
  
  return {
    ...data,
    rsvp_count: data.participants?.length || 0
  };
}

// GET EVENTS (PAGINATED)
export async function getEvents(page = 1, limit = 10, filters = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("events")
    .select(
      `
      id,
      created_at,
      name,
      event_date,
      event_time,
      description,
      is_active,
      participants,
      host_user:users!events_host_user_id_fkey(id, name, image_id),
      location:locations(id, latitude, longitude)
    `,
      { count: 'exact' }
    );

  // Only show active events by default
  query = query.eq('is_active', true);

  // Filter by upcoming events only (optional)
  if (filters.upcoming) {
    const today = new Date().toISOString().split('T')[0];
    query = query.gte('event_date', today);
  }

  // Filter by location
  if (filters.location_id) {
    query = query.eq('location_id', filters.location_id);
  }

  // Filter by host user
  if (filters.user_id) {
    query = query.eq('host_user_id', filters.user_id);
  }

  const { data, error, count } = await query
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true })
    .range(from, to);

  if (error) throw error;

  // Add RSVP count to each event
  const eventsWithCount = data.map(event => ({
    ...event,
    rsvp_count: event.participants?.length || 0
  }));

  return {
    events: eventsWithCount,
    total: count,
    page,
    limit
  };
}

// RSVP TO EVENT (add user to participants array)
export async function rsvpToEvent(event_id, user_id) {
  // Get current event
  const { data: event, error: fetchError } = await supabase
    .from("events")
    .select("participants")
    .eq("id", event_id)
    .single();

  if (fetchError) throw fetchError;

  // Check if already RSVP'd
  const participants = event.participants || [];
  if (participants.includes(user_id)) {
    return { message: "Already RSVP'd to this event", data: event };
  }

  // Add user to participants
  const { data, error } = await supabase
    .from("events")
    .update({
      participants: [...participants, user_id]
    })
    .eq("id", event_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// UN-RSVP FROM EVENT (remove user from participants array)
export async function unrsvpFromEvent(event_id, user_id) {
  // Get current event
  const { data: event, error: fetchError } = await supabase
    .from("events")
    .select("participants")
    .eq("id", event_id)
    .single();

  if (fetchError) throw fetchError;

  // Remove user from participants
  const participants = event.participants || [];
  const updatedParticipants = participants.filter(id => id !== user_id);

  const { error } = await supabase
    .from("events")
    .update({
      participants: updatedParticipants
    })
    .eq("id", event_id);

  if (error) throw error;
  return true;
}

// GET USER'S RSVP'D EVENTS
export async function getUserRSVPs(user_id, page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      created_at,
      name,
      event_date,
      event_time,
      description,
      is_active,
      participants,
      host_user:users!events_host_user_id_fkey(id, name, image_id),
      location:locations(id, latitude, longitude)
    `
    )
    .contains('participants', [user_id])
    .eq('is_active', true)
    .order("event_date", { ascending: true })
    .range(from, to);

  if (error) throw error;
  
  // Add RSVP count to each event
  return data.map(event => ({
    ...event,
    rsvp_count: event.participants?.length || 0
  }));
}

// CHECK IF USER RSVP'D TO EVENT
export async function hasUserRSVPd(event_id, user_id) {
  const { data, error } = await supabase
    .from("events")
    .select("participants")
    .eq("id", event_id)
    .single();

  if (error) throw error;
  
  const participants = data.participants || [];
  return participants.includes(user_id);
}

// DELETE EVENT (only by creator)
export async function deleteEvent(event_id, user_id) {
  // First verify the user owns this event
  const { data: event } = await supabase
    .from("events")
    .select("host_user_id")
    .eq("id", event_id)
    .single();

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.host_user_id !== user_id) {
    throw new Error("Unauthorized: You can only delete your own events");
  }

  // Soft delete by setting is_active to false
  const { error } = await supabase
    .from("events")
    .update({ is_active: false })
    .eq("id", event_id)
    .eq("host_user_id", user_id);

  if (error) throw error;
  return true;
}