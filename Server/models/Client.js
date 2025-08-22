import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientLocation: { type: String },
  gst: { type: String },
  email: { type: String },
  spoc: { type: String },
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);
