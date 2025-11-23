import fetch from 'node-fetch';

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

/**
 * Get nearby Mapbox static street images
 * Uses Mapbox Static Images API to generate street-level views
 */
export async function getNearbyMapboxImages(latitude, longitude, radiusKm = 2) {
  try {
    console.log('🗺️ Generating Mapbox street images...');
    console.log('  Center:', latitude, longitude);
    console.log('  Radius:', radiusKm, 'km');
    console.log('  Token present:', !!MAPBOX_ACCESS_TOKEN);

    // Generate a grid of points around the center
    const points = generateGridPoints(latitude, longitude, radiusKm, 20); // 20 points
    
    // Get current time as Unix timestamp (milliseconds)
    const capturedAt = Date.now();
    
    const images = points.map((point, index) => {
      // Generate different angles for variety
      const bearing = (index * 60) % 360; // Rotate view
      const pitch = 0; // Ground level
      const zoom = 17; // Street level zoom
      const width = 640;
      const height = 480;
      
      // Mapbox Static Images API URL
      const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${point.lon},${point.lat},${zoom},${bearing},${pitch}/${width}x${height}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;
      
      // Thumbnail URL (smaller)
      const thumbUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${point.lon},${point.lat},${zoom},${bearing},${pitch}/256x256?access_token=${MAPBOX_ACCESS_TOKEN}`;
      
      return {
        id: `mapbox_${point.lat}_${point.lon}_${bearing}`,
        geometry: {
          coordinates: [point.lon, point.lat]
        },
        captured_at: capturedAt, // Unix timestamp in milliseconds
        compass_angle: bearing,
        is_pano: false,
        thumb_1024_url: imageUrl,
        thumb_256_url: thumbUrl,
        distance: calculateDistance(latitude, longitude, point.lat, point.lon),
        source: 'mapbox'
      };
    });

    console.log(`  ✅ Generated ${images.length} Mapbox images`);
    
    // Sort by distance
    return images.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('❌ Error generating Mapbox images:', error);
    throw error;
  }
}

/**
 * Generate a grid of points around a center location
 */
function generateGridPoints(centerLat, centerLon, radiusKm, count = 20) {
  const points = [];
  
  // Create a spiral pattern of points
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
  
  for (let i = 0; i < count; i++) {
    const theta = i * goldenAngle;
    const radiusRatio = Math.sqrt(i / count); // Distribute evenly
    
    const r = radiusRatio * radiusKm;
    
    // Convert to lat/lon offset
    const latOffset = (r / 111) * Math.cos(theta); // 111 km per degree latitude
    const lonOffset = (r / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(theta);
    
    points.push({
      lat: centerLat + latOffset,
      lon: centerLon + lonOffset
    });
  }
  
  return points;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get a random Mapbox image near a location
 */
export async function getRandomMapboxImage(latitude, longitude, radiusKm = 1) {
  try {
    const images = await getNearbyMapboxImages(latitude, longitude, radiusKm);
    
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(images.length, 10));
      console.log(`Found Mapbox image at ${radiusKm}km radius`);
      return images[randomIndex];
    }
    
    console.log('No Mapbox images generated');
    return null;
  } catch (error) {
    console.error('Error getting random Mapbox image:', error);
    return null;
  }
}

/**
 * Get Mapbox satellite/hybrid imagery (alternative view)
 */
export async function getMapboxSatelliteImage(latitude, longitude, zoom = 17) {
  const width = 640;
  const height = 480;
  const capturedAt = Date.now(); // Unix timestamp
  
  const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${longitude},${latitude},${zoom}/${width}x${height}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;
  
  return {
    id: `mapbox_sat_${latitude}_${longitude}`,
    geometry: { coordinates: [longitude, latitude] },
    thumb_1024_url: imageUrl,
    thumb_256_url: imageUrl.replace(`${width}x${height}@2x`, '256x256'),
    captured_at: capturedAt,
    source: 'mapbox-satellite'
  };
}

export default {
  getNearbyMapboxImages,
  getRandomMapboxImage,
  getMapboxSatelliteImage
};