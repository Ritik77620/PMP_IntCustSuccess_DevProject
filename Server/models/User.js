import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    passCode: { type: String, required: true },
    role: { type: String, enum: ["Write", "View"], default: "View" },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
