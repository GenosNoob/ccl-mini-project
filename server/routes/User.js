import express from "express";
import {
  UserLogin,
  UserRegister,
  addWorkout,
  getUserDashboard,
  getWorkoutsByDate,
  deleteWorkout,
  updateUserProfile,
  addMeal,
  getMealsByDate,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

router.put("/", verifyToken, updateUserProfile);

router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);
router.delete("/workout/:id", verifyToken, deleteWorkout);

router.post("/meal", verifyToken, addMeal);
router.get("/meal", verifyToken, getMealsByDate);

export default router;
