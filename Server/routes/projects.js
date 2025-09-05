import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new project
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // ✅ ensure required fields
    if (!data.project || !data.projectCode || !data.name || !data.client || !data.milestone || !data.planStart) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate gapInDays if both actualStart and actualClose exist
    if (data.actualStart && data.actualClose) {
      const start = new Date(data.actualStart);
      const close = new Date(data.actualClose);
      data.gapInDays = Math.ceil(
        (close.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    const project = new Project(data);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE project
router.put("/:id", async (req, res) => {
  try {
    const data = req.body;

    // Recalculate gapInDays if dates changed
    if (data.actualStart && data.actualClose) {
      const start = new Date(data.actualStart);
      const close = new Date(data.actualClose);
      data.gapInDays = Math.ceil(
        (close.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
