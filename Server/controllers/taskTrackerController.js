import TaskTracker from "../models/TaskTracker.js";

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await TaskTracker.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// GET single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await TaskTracker.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    console.error("Get Task Error:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

// CREATE new task
export const createTask = async (req, res) => {
  try {
    const task = new TaskTracker(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// UPDATE task by ID
export const updateTask = async (req, res) => {
  try {
    const task = await TaskTracker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// DELETE task by ID
export const deleteTask = async (req, res) => {
  try {
    const task = await TaskTracker.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
