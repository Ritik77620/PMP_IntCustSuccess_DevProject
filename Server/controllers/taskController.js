import TaskTracker from "../models/TaskTracker.js";

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await TaskTracker.find().sort({ raisedDate: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new task
export const createTask = async (req, res) => {
  try {
    const task = new TaskTracker(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update task
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await TaskTracker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  try {
    await TaskTracker.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
