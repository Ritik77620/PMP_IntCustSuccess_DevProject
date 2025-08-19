import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import projectRoutes from './routes/projects.js';
import clientsRoutes from "./routes/Clinets.js";
import usersRoutes from "./routes/users.js";
import vendorsRoutes from "./routes/vendors.js";
import timeEntriesRoutes from "./routes/timeEntries.js";
import cors from 'cors';

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.get(
    '/', (req, res) => {
        res.send('API is running...');
    }  
)
app.use('/api/projects', projectRoutes); // ✅ correct path
app.use("/api/clients", clientsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/time-entries", timeEntriesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
