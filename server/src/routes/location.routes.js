import { Router } from "express";
// You will need to create this controller next
import { addLocation, getLocations } from "../controllers/location.controller.js";

const router = Router();

// Route: GET /api/v1/locations (Fetch all spots)
// Route: POST /api/v1/locations (Add a new spot)
router.route("/")
    .get(getLocations)
    .post(addLocation);

export default router;