import express from "express";
import Milestone from "../models/Milestone.js";

const router = express.Router();

// GET all milestones sorted by weightage ascending
router.get("/", async (req, res) => {
  try {
    const milestones = await Milestone.find().sort({ weightage: 1 });
    // Map to frontend-friendly format
    const data = milestones.map(m => ({
      id: m._id.toString(),
      name: m.name,
      weightage: m.weightage
    }));
    res.json(data);
  } catch (error) {
    console.error("Milestone GET error:", error);
    res.status(500).json({ message: "Failed to fetch milestones" });
  }
});

// POST add new milestone
router.post("/", async (req, res) => {
  try {
    const { name, weightage } = req.body;
    if (!name || weightage === undefined) {
      return res.status(400).json({ message: "Name and weightage are required" });
    }
    const milestone = new Milestone({ name, weightage });
    await milestone.save();
    res.status(201).json({ 
      id: milestone._id.toString(), 
      name: milestone.name, 
      weightage: milestone.weightage 
    });
  } catch (error) {
    console.error("Milestone POST error:", error);
    res.status(500).json({ message: "Failed to save milestone" });
  }
});

// PUT update milestone by id
router.put("/:id", async (req, res) => {
  try {
    const { name, weightage } = req.body;
    if (!name || weightage === undefined) {
      return res.status(400).json({ message: "Name and weightage are required" });
    }
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      { name, weightage },
      { new: true }
    );
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }
    res.json({ 
      id: milestone._id.toString(), 
      name: milestone.name, 
      weightage: milestone.weightage 
    });
  } catch (error) {
    console.error("Milestone PUT error:", error);
    res.status(500).json({ message: "Failed to update milestone" });
  }
});

// DELETE milestone by id
router.delete("/:id", async (req, res) => {
  try {
    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ message: "Milestone deleted" });
  } catch (error) {
    console.error("Milestone DELETE error:", error);
    res.status(500).json({ message: "Failed to delete milestone" });
  }
});

export default router;
