import express from "express";
import Ticket from "../models/Ticket.js";

const router = express.Router();

// GET all tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets.map(t => ({
      id: t._id.toString(),
      ...t.toObject(),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
});

// POST new ticket
router.post("/", async (req, res) => {
  try {
    console.log("Received POST /tickets", req.body);
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json({ id: ticket._id.toString(), ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create ticket" });
  }
});

// PUT update ticket
router.put("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ id: ticket._id.toString(), ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ticket" });
  }
});

// DELETE ticket
router.delete("/:id", async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
});

export default router;
