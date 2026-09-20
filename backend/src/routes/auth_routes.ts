import { Router } from "express";
import { getProfile, login, register, updateProfile } from "../controllers/auth_controller";
import { authenticate } from "../middleware/auth_middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);

export default router;
