// routes/projects.js
import express from 'express';
import Project from '../models/Project.js'; // adjust if using named/default export

const router = express.Router(); // ✅ Initialize router first

// Controller functions
export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Routes
router.post('/', createProject);
router.get('/', getProjects);

export default router; // ✅ default export
