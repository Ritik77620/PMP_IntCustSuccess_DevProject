import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  vendorLocation: { type: String },
  vendorGst: { type: String },
  email: { type: String },
  spoc: { type: String },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
