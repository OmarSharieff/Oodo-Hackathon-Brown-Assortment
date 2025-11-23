import express from 'express';
import { 
  getCachedMapillaryLocations, 
  isCacheStale, 
  refreshMapboxCacheInBackground, // Updated name
  saveMapboxLocations
} from '../db/queries.js';
import { getNearbyMapboxImages } from '../services/mapboxService.js';

const router = express.Router();

/**
 * GET /api/mapillary/nearby-cached
 * Get cached Mapillary locations with background refresh if stale
 */
router.get('/nearby-cached', async (req, res) => {
  try {
    const { latitude, longitude, radius = 2, limit = 50 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);
    const lim = parseInt(limit);

    console.log(`🔍 Fetching cached Mapillary images near: ${lat}, ${lon} within ${rad}km`);

    // Get cached locations
    const cachedLocations = await getCachedMapillaryLocations(lat, lon, rad, lim);
    
    console.log(`📦 Found ${cachedLocations.length} cached Mapillary locations`);

    // Check if cache is stale
    const isStale = isCacheStale(cachedLocations, 60); // 60 minutes

    if (isStale) {
      console.log('⏰ Cache is stale, triggering background refresh...');
      // Trigger background refresh (don't await)
      refreshMapboxCacheInBackground(lat, lon, rad).catch(err => {
        console.error('Background refresh error:', err);
      });
    } else {
      console.log('✅ Cache is fresh');
    }

    res.json({
      success: true,
      data: cachedLocations,
      count: cachedLocations.length,
      cached: true,
      stale: isStale
    });
  } catch (error) {
    console.error('❌ Error in /api/mapillary/nearby-cached:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/mapillary/test-and-populate
 * Test Mapillary API and populate initial cache
 */
router.get('/test-and-populate', async (req, res) => {
  try {
    const { latitude = 50.82055797368375, longitude = 4.402875123647935, radius = 2 } = req.query;

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    console.log('🗺️ Testing Mapbox API and populating cache...');
    console.log(`📍 Location: ${lat}, ${lon}`);
    console.log(`📏 Radius: ${rad}km`);
    console.log(`🔑 Token present: ${!!process.env.MAPBOX_ACCESS_TOKEN}`);
    console.log(`🔑 Token format: ${process.env.MAPBOX_ACCESS_TOKEN?.substring(0, 15)}...`);

    // Fetch from Mapbox
    const images = await getNearbyMapboxImages(lat, lon, rad);
    
    console.log(`📸 Generated ${images.length} images from Mapbox`);

    if (images.length === 0) {
      return res.json({
        success: false,
        message: 'No Mapbox images generated',
        data: [],
        count: 0,
        token_present: !!process.env.MAPBOX_ACCESS_TOKEN
      });
    }

    // Save to database
    const saved = await saveMapboxLocations(images);
    
    console.log(`✅ Saved ${saved.length} locations to database`);

    res.json({
      success: true,
      message: 'Cache populated successfully with Mapbox images',
      data: saved,
      count: saved.length
    });
  } catch (error) {
    console.error('❌ Error in test-and-populate:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/mapillary/refresh
 * Manually trigger a cache refresh
 */
router.get('/refresh', async (req, res) => {
  try {
    const { latitude, longitude, radius = 2 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    console.log(`🔄 Manual refresh triggered for: ${lat}, ${lon}`);

    await refreshMapillaryCacheInBackground(lat, lon, rad);

    const locations = await getCachedMapillaryLocations(lat, lon, rad);

    res.json({
      success: true,
      message: 'Cache refreshed successfully',
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Error in /api/mapillary/refresh:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;