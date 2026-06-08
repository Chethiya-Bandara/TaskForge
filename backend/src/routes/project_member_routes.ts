import { Router } from "express";
import { authenticate } from "../middleware/auth_middleware";
import { addMember, getMembers, deleteMember } from "../controllers/project_member_controller";
import { checkProjectOwner, checkProjectMember } from "../middleware/project_member_middleware";

const router = Router();

router.post("/:id/members", authenticate, checkProjectOwner, addMember);

router.get("/:id/members", authenticate, checkProjectMember, getMembers);

router.delete("/:id/members/:userId", authenticate, checkProjectOwner, deleteMember);

export default router;

