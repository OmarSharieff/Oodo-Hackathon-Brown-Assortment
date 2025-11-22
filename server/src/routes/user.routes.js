import { Router } from "express";
import { addUser } from "../controllers/user.controller.js";

const router = Router();

// Route: POST /api/v1/users/register
router.route("/register").post(addUser);

// Example: Route to get a user profile (you can add this controller function later)
// router.route("/:id").get(getUserProfile);

export default router;