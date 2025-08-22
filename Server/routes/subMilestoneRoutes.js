import express from "express";
import SubMilestone from "../models/Submilestone.js";

const router = express.Router();

// Get all sub-milestones
router.get("/", async (req, res) => {
  const submilestones = await SubMilestone.find().sort({ sequence: 1 });
  res.json(submilestones.map(s => ({
    id: s._id,
    name: s.name,
    milestoneId: s.milestoneId,
    sequence: s.sequence,
  })));
});

// Add sub-milestone
router.post("/", async (req, res) => {
  const sm = new SubMilestone(req.body);
  await sm.save();
  res.json({ id: sm._id, name: sm.name, milestoneId: sm.milestoneId, sequence: sm.sequence });
});

// Update sub-milestone
router.put("/:id", async (req, res) => {
  const sm = await SubMilestone.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ id: sm._id, name: sm.name, milestoneId: sm.milestoneId, sequence: sm.sequence });
});

// Delete sub-milestone
router.delete("/:id", async (req, res) => {
  await SubMilestone.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
