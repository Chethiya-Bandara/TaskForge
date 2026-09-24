import { Router } from "express";
import { getProfile, login, logout, logoutAll, refresh, register, updateProfile } from "../controllers/auth_controller";
import { authenticate } from "../middleware/auth_middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.post("/logout-all", authenticate, logoutAll);

router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);

export default router;
