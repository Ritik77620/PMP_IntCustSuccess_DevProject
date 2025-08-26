import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Routes
import project from "./routes/projects.js";
import clientsRoutes from "./routes/clientRoutes.js";   
import usersRoutes from "./routes/users.js";
import vendorsRoutes from "./routes/vendors.js";
import timeEntriesRoutes from "./routes/timeEntries.js";
import taskRoutes from "./routes/taskRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import masterProjectRoutes from "./routes/masterProjectRoutes.js";
import subMilestoneRoutes from "./routes/subMilestoneRoutes.js";
import ticketRoutes from "./routes/tickets.js";
// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// API Routes
app.use("/api/projects", project);
app.use("/api/clients", clientsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/time-entries", timeEntriesRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/masterprojects", masterProjectRoutes);

app.use("/api/submilestones", subMilestoneRoutes);
app.use("/api/tickets", ticketRoutes);

// Server Listen
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
