import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.route("/")
  .get(getTasks)   // GET /api/tasks
  .post(createTask); // POST /api/tasks

router.route("/:id")
  .put(updateTask)   // PUT /api/tasks/:id
  .delete(deleteTask); // DELETE /api/tasks/:id

export default router;
