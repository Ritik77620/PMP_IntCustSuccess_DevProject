import express from "express";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// Get all vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(
      vendors.map((v) => ({
        id: v._id.toString(),
        vendorName: v.vendorName,
        vendorLocation: v.vendorLocation,
        vendorGst: v.vendorGst,
        email: v.email,
        spoc: v.spoc,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve vendors" });
  }
});

// Create new vendor
router.post("/", async (req, res) => {
  try {
    if (!req.body.vendorName) {
      return res.status(400).json({ message: "vendorName is required" });
    }
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json({
      id: vendor._id.toString(),
      vendorName: vendor.vendorName,
      vendorLocation: vendor.vendorLocation,
      vendorGst: vendor.vendorGst,
      email: vendor.email,
      spoc: vendor.spoc,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create vendor" });
  }
});

// Update vendor by ID
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.vendorName) {
      return res.status(400).json({ message: "vendorName is required" });
    }
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({
      id: vendor._id.toString(),
      vendorName: vendor.vendorName,
      vendorLocation: vendor.vendorLocation,
      vendorGst: vendor.vendorGst,
      email: vendor.email,
      spoc: vendor.spoc,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update vendor" });
  }
});

// Delete vendor by ID
router.delete("/:id", async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendor deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vendor" });
  }
});

export default router;
