import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getAllGigs,
  myGigs,
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router();

router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/mygigs", verifyToken, myGigs);
router.get("/", getAllGigs);

export default router;
