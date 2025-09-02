import express from "express";
import ProjectMilestone from "../models/ProjectMilestone.js";

const router = express.Router();

// Get all milestones for a project
router.get("/:projectId/projectMilestones", async (req, res) => {
  const { projectId } = req.params;
  try {
    const milestones = await ProjectMilestone.find({ projectId });
    res.json(milestones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
});

// Add a new milestone for a project
router.post("/:projectId/projectMilestones", async (req, res) => {
  const { projectId } = req.params;
  const data = { ...req.body, projectId, status: req.body.status || "Open" }; // default status

  try {
    const milestone = new ProjectMilestone(data);
    await milestone.save();
    res.status(201).json(milestone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save milestone" });
  }
});

// Update an existing milestone
router.put("/:projectId/projectMilestones/:milestoneId", async (req, res) => {
  const { milestoneId } = req.params;
  try {
    const updated = await ProjectMilestone.findByIdAndUpdate(
      milestoneId,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update milestone" });
  }
});

// Delete a milestone
router.delete("/:projectId/projectMilestones/:milestoneId", async (req, res) => {
  const { milestoneId } = req.params;
  try {
    await ProjectMilestone.findByIdAndDelete(milestoneId);
    res.json({ message: "Milestone deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete milestone" });
  }
});

export default router;
