import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/reorder", reorderTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
