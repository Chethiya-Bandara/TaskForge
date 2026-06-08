import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum([
    "todo",
    "in_progress",
    "completed",
  ]).optional(),
  priority: z.enum([
    "low",
    "medium",
    "high",
  ]).optional(),
  assignedToId: z.string().uuid().optional(),
});