import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  unitName: { type: String, required: true },
});

const locationSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  spoc: { type: String }, // SPOC per location
  units: { type: [unitSchema], default: [] },
});

const clientSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    gst: { type: String },
    email: { type: String, required: true, unique: true },
    locations: { type: [locationSchema], default: [] }, // SPOC moved inside locations
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
