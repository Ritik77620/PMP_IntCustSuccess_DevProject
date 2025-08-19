import express from "express";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// GET all vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new vendor
router.post("/", async (req, res) => {
  const vendor = new Vendor(req.body);
  try {
    const savedVendor = await vendor.save();
    res.status(201).json(savedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a vendor
router.put("/:id", async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(updatedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a vendor
router.delete("/:id", async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
