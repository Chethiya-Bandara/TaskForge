import { object, z } from "zod";

export const createProjectSchema = z.object({
  name: z
  .string()
  .trim()
  .min(3, "Project name must be more than 3 characters")
  .max(100, "Project name must not be more than 100 characters"),

  description: z
  .string()
  .trim()
  .max(1000, "Project description must be less than 1000 characters")
  .optional(),
});

export const updatedProjectSchema = createProjectSchema
.partial()
.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided to update."
  }
);