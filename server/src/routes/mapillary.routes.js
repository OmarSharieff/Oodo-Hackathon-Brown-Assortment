import express from 'express';
import { 
  getCachedMapillaryLocations, 
  isCacheStale, 
  refreshImageCacheInBackground,
  saveImageLocations
} from '../db/queries.js';
import { getNearbyImages } from '../services/unifiedImageryService.js';

const router = express.Router();

/**
 * GET /api/mapillary/nearby-cached
 * Get cached street view images with background refresh if stale
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

    console.log(`🔍 Fetching cached images near: ${lat}, ${lon} within ${rad}km`);

    // Get cached locations
    const cachedLocations = await getCachedMapillaryLocations(lat, lon, rad, lim);
    
    console.log(`📦 Found ${cachedLocations.length} cached locations`);

    // Check if cache is stale
    const isStale = isCacheStale(cachedLocations, 60); // 60 minutes

    if (isStale) {
      console.log('⏰ Cache is stale, triggering background refresh...');
      // Trigger background refresh (don't await)
      refreshImageCacheInBackground(lat, lon, rad).catch(err => {
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
 * Test API and populate initial cache with Mapillary + Mapbox images
 */
router.get('/test-and-populate', async (req, res) => {
  try {
    const { latitude = 50.82055797368375, longitude = 4.402875123647935, radius = 2 } = req.query;

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    console.log('🗺️ Testing imagery APIs and populating cache...');
    console.log(`📍 Location: ${lat}, ${lon}`);
    console.log(`📏 Radius: ${rad}km`);
    console.log(`🔑 Mapillary token: ${!!process.env.MAPILLARY_ACCESS_TOKEN}`);
    console.log(`🔑 Mapbox token: ${!!process.env.MAPBOX_ACCESS_TOKEN}`);

    // Fetch from both Mapillary and Mapbox
    const images = await getNearbyImages(lat, lon, rad);
    
    console.log(`📸 Found ${images.length} total images`);

    if (images.length === 0) {
      return res.json({
        success: false,
        message: 'No images found from any source',
        data: [],
        count: 0,
        mapillary_token: !!process.env.MAPILLARY_ACCESS_TOKEN,
        mapbox_token: !!process.env.MAPBOX_ACCESS_TOKEN
      });
    }

    // Group by source for reporting
    const bySource = images.reduce((acc, img) => {
      acc[img.source] = (acc[img.source] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Images by source:', bySource);

    // Save to database
    const saved = await saveImageLocations(images);
    
    console.log(`✅ Saved ${saved.length} locations to database`);

    res.json({
      success: true,
      message: 'Cache populated successfully',
      data: saved,
      count: saved.length,
      sources: bySource
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

    await refreshImageCacheInBackground(lat, lon, rad);

    const locations = await getCachedMapillaryLocations(lat, lon, rad);

    res.json({
      success: true,
      message: 'Cache refreshed successfully',
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('❌ Error in /api/mapillary/refresh:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;