import express from "express";
import Milestone from "../models/Milestone.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, sequence } = req.body;
    if (!name || sequence === undefined) {
      return res.status(400).json({ message: "Name and sequence are required" });
    }

    const milestone = new Milestone({ name, sequence });
    await milestone.save();
    res.status(201).json({ id: milestone._id, name: milestone.name, sequence: milestone.sequence });
  } catch (error) {
    console.error("Milestone create error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
