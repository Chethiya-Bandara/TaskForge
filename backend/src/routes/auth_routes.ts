import { Router } from "express";
import { getProfile, login, logout, logoutAll, refresh, register, updateProfile } from "../controllers/auth_controller";
import { authenticate } from "../middleware/auth_middleware";
import { loginLimiter, registerLimiter } from "../middleware/rate_limit_middleware";

const router = Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.post("/logout-all", authenticate, logoutAll);

router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);

export default router;
