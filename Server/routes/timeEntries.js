import express from "express";
import TimeEntry from "../models/TimeEntry.js";

const router = express.Router();

// GET all time entries
router.get("/", async (req, res) => {
  try {
    const entries = await TimeEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new time entry
router.post("/", async (req, res) => {
  try {
    const entry = new TimeEntry(req.body);
    const savedEntry = await entry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a time entry
router.put("/:id", async (req, res) => {
  try {
    const updatedEntry = await TimeEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) return res.status(404).json({ message: "Time entry not found" });
    res.json(updatedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a time entry
router.delete("/:id", async (req, res) => {
  try {
    const deletedEntry = await TimeEntry.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ message: "Time entry not found" });
    res.json({ message: "Time entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
