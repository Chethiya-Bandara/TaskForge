import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  dueDate: z.string().optional(),
});