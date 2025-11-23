import { Router } from 'express';
import {
  handleAddLocation,
  handleFindLocation,
  handleGetHottestLocations,
  handleGetNearbyHotspots,
  handleGetNearbyLocations,
  handleGetNearbyGreenHotspots
} from '../controllers/location.controller.js';
import supabase from '../db/index.js';

const router = Router();

router.post('/', handleAddLocation);
router.get('/search', handleFindLocation);
router.get('/hottest', handleGetHottestLocations);

// IMPORTANT: Specific routes BEFORE general routes
router.get('/nearby/green-hotspots', handleGetNearbyGreenHotspots);
router.get('/nearby/hotspots', handleGetNearbyHotspots);
router.get('/nearby', handleGetNearbyLocations);

// Add the /with-images route
router.get('/with-images', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Get posts with images and their locations
    const { data: postsWithLocations, error } = await supabase
      .from('posts')
      .select(`
        id,
        image_url,
        description,
        rating,
        created_at,
        location:locations(id, latitude, longitude, near_greenery, halal, crowded, hotspot)
      `)
      .not('image_url', 'is', null);

    if (error) throw error;

    // Filter by distance and transform
    const locationsWithImages = postsWithLocations
      .filter(post => post.location)
      .map(post => {
        const distance = calculateDistance(
          lat,
          lon,
          parseFloat(post.location.latitude),
          parseFloat(post.location.longitude)
        );
        
        return {
          id: `post_${post.id}`,
          type: 'post',
          latitude: parseFloat(post.location.latitude),
          longitude: parseFloat(post.location.longitude),
          image_url: post.image_url,
          description: post.description,
          rating: post.rating,
          created_at: post.created_at,
          distance,
          near_greenery: post.location.near_greenery || false,
          halal: post.location.halal || false,
          crowded: post.location.crowded || false,
          hotspot: post.location.hotspot || false,
        };
      })
      .filter(loc => loc.distance <= rad)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: locationsWithImages,
      count: locationsWithImages.length
    });
  } catch (error) {
    console.error('Error in /api/locations/with-images:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function
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

export default router;