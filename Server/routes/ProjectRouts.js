import express from "express";
import Project from "../models/Projectmodels.js";

const router = express.Router();

// Create Project
router.post("/", async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;

    const project = new Project({
      name,
      description,
      startDate,
      endDate,
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error saving project:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get All Projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
