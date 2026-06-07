import { Router } from "express";
import { login, register } from "../controllers/auth_controller";
import { authenticate, AuthRequest} from "../middleware/auth_middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/me",
  authenticate,
  (req: AuthRequest, res) => {
    res.json(req.user);
  }
);

export default router;