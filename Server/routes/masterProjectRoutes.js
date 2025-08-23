import express from "express";
import {
  createMasterProject,
  getMasterProjects,
  getMasterProjectById,
  updateMasterProject,
  deleteMasterProject,
} from "../controllers/masterProjectController.js";

const router = express.Router();

// CRUD APIs
router.post("/", createMasterProject);
router.get("/", getMasterProjects);
router.get("/:id", getMasterProjectById);
router.put("/:id", updateMasterProject);
router.delete("/:id", deleteMasterProject);

export default router;
