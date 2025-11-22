import { Router } from 'express';
import {
  handleAddLocation,
  handleFindLocation,
  handleGetHottestLocations,
  handleGetNearbyHotspots,
  handleGetNearbyLocations,
  handleGetNearbyGreenHotspots
} from '../controllers/location.controller.js';

const router = Router();

router.post('/', handleAddLocation);
router.get('/search', handleFindLocation);
router.get('/hottest', handleGetHottestLocations);

// IMPORTANT: Specific routes BEFORE general routes
router.get('/nearby/green-hotspots', handleGetNearbyGreenHotspots);
router.get('/nearby/hotspots', handleGetNearbyHotspots);
router.get('/nearby', handleGetNearbyLocations);

export default router;