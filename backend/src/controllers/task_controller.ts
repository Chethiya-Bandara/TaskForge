import { Response } from "express";
import prisma from "../prisma/client.js";
import { AuthRequest } from "../types/auth";
import { createTaskSchema, updateTaskSchema } from "../validators/task_validator";
import { Prisma } from "@prisma/client";

// Get tasks
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id as string;

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        createdBy: true,
        assignedTo: true,
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get tasks",
    });
  }
};

// Create task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const data = createTaskSchema.parse(req.body);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        priority: data.priority ?? "medium",
        projectId,
        createdById: req.user!.userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add task",
    });
  }
};

// Update task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id as string;

    const data = updateTaskSchema.parse(req.body);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId: task.projectId,
        userId: req.user!.userId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const updateData: Prisma.TaskUncheckedUpdateInput = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }

    // assignedToId validation
    if (data.assignedToId !== undefined) {
      const assignee = await prisma.projectMember.findFirst({
        where: {
          projectId: task.projectId,
          userId: data.assignedToId,
        },
      });

      if (!assignee) {
        return res.status(400).json({
          message: "User is not a member of this project",
        });
      }

      updateData.assignedToId = data.assignedToId;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// Delete task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id as string;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isOwner = await prisma.projectMember.findFirst({
      where: {
        projectId: task.projectId,
        userId: req.user!.userId,
        role: "owner",
      },
    });

    const isCreator = task.createdById === req.user!.userId;

    if (!isOwner && !isCreator) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};