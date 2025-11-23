// To calculate distanvece between two geographical points using the Haversine formula
/**
 * Calculate distance between two geographical points using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate bounding box coordinates for a given point and radius
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {object} Bounding box with minLat, maxLat, minLon, maxLon
 */
export function getBoundingBox(latitude, longitude, radiusKm) {
  const latRadian = toRadians(latitude);
  
  // Radius of Earth in km
  const R = 6371;
  
  // Angular distance in radians on a great circle
  const radDist = radiusKm / R;
  
  const minLat = latitude - (radDist * 180 / Math.PI);
  const maxLat = latitude + (radDist * 180 / Math.PI);
  
  const minLon = longitude - (radDist * 180 / Math.PI) / Math.cos(latRadian);
  const maxLon = longitude + (radDist * 180 / Math.PI) / Math.cos(latRadian);
  
  return {
    minLat,
    maxLat,
    minLon,
    maxLon
  };
}

/**
 * Filter locations by distance from a point
 * @param {Array} locations - Array of location objects with latitude and longitude
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {number} maxDistance - Maximum distance in kilometers
 * @returns {Array} Filtered and sorted locations with distance property
 */
export function filterLocationsByDistance(locations, userLat, userLon, maxDistance) {
  return locations
    .map(location => ({
      ...location,
      distance: calculateDistance(
        userLat,
        userLon,
        parseFloat(location.latitude),
        parseFloat(location.longitude)
      )
    }))
    .filter(location => location.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}