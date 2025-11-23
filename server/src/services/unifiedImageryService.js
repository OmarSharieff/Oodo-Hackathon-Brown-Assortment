import fetch from 'node-fetch';

const MAPILLARY_ACCESS_TOKEN = process.env.MAPILLARY_ACCESS_TOKEN;
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

/**
 * Get nearby images from BOTH Mapillary (street photos) AND Mapbox (map views)
 * This ensures we always have imagery, even if Mapillary has no coverage
 */
export async function getNearbyImages(latitude, longitude, radiusKm = 2) {
  const allImages = [];
  
  // Try Mapillary first (real street photos)
  if (MAPILLARY_ACCESS_TOKEN) {
    try {
      console.log('📷 Trying Mapillary for real street photos...');
      const mapillaryImages = await getMapillaryImages(latitude, longitude, radiusKm);
      allImages.push(...mapillaryImages);
      console.log(`  ✅ Got ${mapillaryImages.length} Mapillary images`);
    } catch (error) {
      console.error('⚠️ Mapillary failed:', error.message);
    }
  }
  
  // Always add Mapbox as fallback (map views)
  if (MAPBOX_ACCESS_TOKEN) {
    try {
      console.log('🗺️ Adding Mapbox map views as backup...');
      const mapboxImages = await getMapboxImages(latitude, longitude, radiusKm);
      allImages.push(...mapboxImages);
      console.log(`  ✅ Got ${mapboxImages.length} Mapbox images`);
    } catch (error) {
      console.error('⚠️ Mapbox failed:', error.message);
    }
  }
  
  // Sort by distance
  allImages.sort((a, b) => a.distance - b.distance);
  
  console.log(`📸 Total images from all sources: ${allImages.length}`);
  return allImages;
}

/**
 * Get Mapillary street-level photos
 */
async function getMapillaryImages(latitude, longitude, radiusKm) {
  const radiusMeters = radiusKm * 1000;
  const bbox = getBbox(latitude, longitude, radiusMeters);
  
  const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_ACCESS_TOKEN}&fields=id,thumb_1024_url,thumb_256_url,captured_at,compass_angle,geometry,is_pano&bbox=${bbox}&limit=30`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Mapillary API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    return [];
  }
  
  return data.data.map(img => ({
    id: `mapillary_${img.id}`,
    geometry: img.geometry,
    captured_at: img.captured_at ? parseInt(img.captured_at) : Date.now(),
    compass_angle: img.compass_angle || 0,
    is_pano: img.is_pano || false,
    thumb_1024_url: img.thumb_1024_url,
    thumb_256_url: img.thumb_256_url,
    distance: calculateDistance(
      latitude,
      longitude,
      img.geometry.coordinates[1],
      img.geometry.coordinates[0]
    ),
    source: 'mapillary'
  }));
}

/**
 * Get Mapbox static map views (as fallback/supplement)
 */
async function getMapboxImages(latitude, longitude, radiusKm) {
  const points = generateGridPoints(latitude, longitude, radiusKm, 10); // Only 10 points
  const capturedAt = Date.now();
  
  return points.map((point, index) => {
    const bearing = (index * 60) % 360;
    const zoom = 17;
    
    const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${point.lon},${point.lat},${zoom},${bearing},0/640x480@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;
    const thumbUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${point.lon},${point.lat},${zoom},${bearing},0/256x256?access_token=${MAPBOX_ACCESS_TOKEN}`;
    
    return {
      id: `mapbox_${point.lat}_${point.lon}_${bearing}`,
      geometry: {
        coordinates: [point.lon, point.lat]
      },
      captured_at: capturedAt,
      compass_angle: bearing,
      is_pano: false,
      thumb_1024_url: imageUrl,
      thumb_256_url: thumbUrl,
      distance: calculateDistance(latitude, longitude, point.lat, point.lon),
      source: 'mapbox'
    };
  });
}

/**
 * Get bounding box
 */
function getBbox(lat, lon, radiusMeters) {
  const latOffset = (radiusMeters / 1000) / 111;
  const lonOffset = (radiusMeters / 1000) / (111 * Math.cos(lat * Math.PI / 180));
  
  return `${lon - lonOffset},${lat - latOffset},${lon + lonOffset},${lat + latOffset}`;
}

/**
 * Generate grid of points
 */
function generateGridPoints(centerLat, centerLon, radiusKm, count) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  
  for (let i = 0; i < count; i++) {
    const theta = i * goldenAngle;
    const radiusRatio = Math.sqrt(i / count);
    const r = radiusRatio * radiusKm;
    
    const latOffset = (r / 111) * Math.cos(theta);
    const lonOffset = (r / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(theta);
    
    points.push({
      lat: centerLat + latOffset,
      lon: centerLon + lonOffset
    });
  }
  
  return points;
}

/**
 * Calculate distance
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
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
 * Get random image (tries Mapillary first, falls back to Mapbox)
 */
export async function getRandomImage(latitude, longitude, radiusKm = 1) {
  try {
    const images = await getNearbyImages(latitude, longitude, radiusKm);
    
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(images.length, 10));
      return images[randomIndex];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting random image:', error);
    return null;
  }
}

export default {
  getNearbyImages,
  getRandomImage
};