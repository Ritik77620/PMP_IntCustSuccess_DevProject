import MasterProjectModel from "../models/MasterProjectModel.js";

// ➡️ Create Master Project
export const createMasterProject = async (req, res) => {
  try {
    const { projectName, projectCode, description } = req.body;

    const newProject = new MasterProjectModel({
      projectName,
      projectCode,
      description,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ➡️ Get All Master Projects
export const getMasterProjects = async (req, res) => {
  try {
    const projects = await MasterProjectModel.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡️ Get Single Master Project
export const getMasterProjectById = async (req, res) => {
  try {
    const project = await MasterProjectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡️ Update Master Project
export const updateMasterProject = async (req, res) => {
  try {
    const { projectName, projectCode, description } = req.body;

    const updatedProject = await MasterProjectModel.findByIdAndUpdate(
      req.params.id,
      { projectName, projectCode, description },
      { new: true, runValidators: true }
    );

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ➡️ Delete Master Project
export const deleteMasterProject = async (req, res) => {
  try {
    const deletedProject = await MasterProjectModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedProject)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
