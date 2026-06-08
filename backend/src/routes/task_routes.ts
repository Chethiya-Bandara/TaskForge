import { Router } from "express";
import { authenticate } from "../middleware/auth_middleware";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/task_controller";
import { checkProjectMember } from "../middleware/project_member_middleware";

const router = Router();

router.get("/projects/:id/tasks", authenticate, checkProjectMember, getTasks);

router.post("/projects/:id/tasks", authenticate, checkProjectMember, createTask);

router.patch("/tasks/:id", authenticate, updateTask);

router.delete("/tasks/:id", authenticate, deleteTask);

export default router;