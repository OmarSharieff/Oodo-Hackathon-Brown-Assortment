import {
  addLocation,
  findLocation,
  getHottestLocations,
  getNearbyHotspots,
  getNearbyLocations,
  getNearbyGreenHotspots
} from '../db/queries.js';

// ADD LOCATION
export async function handleAddLocation(req, res) {
  try {
    const { latitude, longitude, halal, crowded, hotspot, near_greenery } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const location = await addLocation({
      latitude,
      longitude,
      halal: halal || false,
      crowded: crowded || false,
      hotspot: hotspot || false,
      near_greenery: near_greenery || false
    });

    res.status(201).json({
      success: true,
      message: 'Location added successfully',
      data: location
    });
  } catch (error) {
    console.error('Add location error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add location'
    });
  }
}

// FIND LOCATION BY COORDINATES
export async function handleFindLocation(req, res) {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude query parameters are required'
      });
    }

    const location = await findLocation(latitude, longitude);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Find location error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to find location'
    });
  }
}

// GET HOTTEST LOCATIONS
export async function handleGetHottestLocations(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;

    if (limit < 1) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be a positive integer'
      });
    }

    if (limit > 50) {
      return res.status(400).json({
        success: false,
        message: 'Limit cannot exceed 50'
      });
    }

    const locations = await getHottestLocations(limit);

    res.status(200).json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Get hottest locations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get hottest locations'
    });
  }
}

// GET NEARBY GREEN HOTSPOTS (only locations near parks/nature)
export async function handleGetNearbyGreenHotspots(req, res) {
  try {
    const { latitude, longitude } = req.query;
    const radius = parseFloat(req.query.radius) || 5;
    const limit = parseInt(req.query.limit) || 20;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude query parameters are required'
      });
    }

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be valid numbers'
      });
    }

    if (radius < 0.1 || radius > 50) {
      return res.status(400).json({
        success: false,
        message: 'Radius must be between 0.1 and 50 kilometers'
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }

    const hotspots = await getNearbyGreenHotspots(
      parseFloat(latitude),
      parseFloat(longitude),
      radius,
      limit
    );

    res.status(200).json({
      success: true,
      data: hotspots,
      count: hotspots.length,
      query: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius,
        limit
      }
    });
  } catch (error) {
    console.error('Get nearby green hotspots error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get nearby green hotspots'
    });
  }
}

// GET NEARBY HOTSPOTS
export async function handleGetNearbyHotspots(req, res) {
  try {
    const { latitude, longitude } = req.query;
    const radius = parseFloat(req.query.radius) || 5;
    const limit = parseInt(req.query.limit) || 20;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude query parameters are required'
      });
    }

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be valid numbers'
      });
    }

    if (radius < 0.1 || radius > 50) {
      return res.status(400).json({
        success: false,
        message: 'Radius must be between 0.1 and 50 kilometers'
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }

    const hotspots = await getNearbyHotspots(
      parseFloat(latitude),
      parseFloat(longitude),
      radius,
      limit
    );

    res.status(200).json({
      success: true,
      data: hotspots,
      count: hotspots.length,
      query: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius,
        limit
      }
    });
  } catch (error) {
    console.error('Get nearby hotspots error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get nearby hotspots'
    });
  }
}

// GET NEARBY LOCATIONS (with filters)
export async function handleGetNearbyLocations(req, res) {
  try {
    const { latitude, longitude } = req.query;
    const radius = parseFloat(req.query.radius) || 5;
    const limit = parseInt(req.query.limit) || 20;

    // Build filters object from query params
    const filters = {};
    if (req.query.near_greenery !== undefined) {
      filters.near_greenery = req.query.near_greenery === 'true';
    }
    if (req.query.halal !== undefined) {
      filters.halal = req.query.halal === 'true';
    }
    if (req.query.crowded !== undefined) {
      filters.crowded = req.query.crowded === 'true';
    }
    if (req.query.hotspot !== undefined) {
      filters.hotspot = req.query.hotspot === 'true';
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude query parameters are required'
      });
    }

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be valid numbers'
      });
    }

    if (radius < 0.1 || radius > 50) {
      return res.status(400).json({
        success: false,
        message: 'Radius must be between 0.1 and 50 kilometers'
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }

    const locations = await getNearbyLocations(
      parseFloat(latitude),
      parseFloat(longitude),
      radius,
      limit,
      filters
    );

    res.status(200).json({
      success: true,
      data: locations,
      count: locations.length,
      filters: filters,
      query: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius,
        limit
      }
    });
  } catch (error) {
    console.error('Get nearby locations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get nearby locations'
    });
  }
}