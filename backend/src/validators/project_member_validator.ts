import { z } from "zod";

export const addProjectMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "member", "viewer"]).optional(),
});