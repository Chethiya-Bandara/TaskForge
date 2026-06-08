import { Router } from "express";
import { authenticate } from "../middleware/auth_middleware";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/project_controller";

const router = Router();

router.get("/", authenticate, getProjects);
router.post("/", authenticate, createProject);
router.get("/:id", authenticate, getProjectById);

router.patch("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;