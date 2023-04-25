import express from "express";
import {
  createReview,
  getReviews,
  deleteReview,
} from "../controllers/reviews.controller.js";
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/:gigId", verifyToken, getReviews);
router.delete("/:id", verifyToken, deleteReview);
// router.post("/", verifyToken, createReview)
export default router;
