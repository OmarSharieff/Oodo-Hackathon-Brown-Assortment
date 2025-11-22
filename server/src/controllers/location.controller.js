import {
  addLocation,
  findLocation,
  getHottestLocations
} from '../db/queries.js';

// ADD LOCATION
export async function handleAddLocation(req, res) {
  try {
    const { latitude, longitude, halal, crowded, hotspot } = req.body;

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
      hotspot: hotspot || false
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
