import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  vendorLocation: { type: String },
  vendorGst: { type: String },
  email: { type: String },
  spoc: { type: String },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
