import { Router } from 'express';
import {
  handleAddLocation,
  handleFindLocation,
  handleGetHottestLocations
} from '../controllers/location.controller.js';

const router = Router();

// Location routes
router.post('/', handleAddLocation);            // POST /api/locations
router.get('/search', handleFindLocation);      // GET /api/locations/search?latitude=X&longitude=Y
router.get('/hottest', handleGetHottestLocations); // GET /api/locations/hottest?limit=10

export default router;