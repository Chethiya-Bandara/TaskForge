import { Response } from "express";
import prisma from "../prisma/client.js";
import { AuthRequest } from "../types/auth";
import { createProjectSchema, updatedProjectSchema } from "../validators/project_validator";
import { ZodError } from "zod";

// Create project
export const createProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: data.name,
          description: data.description ?? null,
        },
      });

      await tx.projectMember.create({
        data: {
          userId: req.user!.userId,
          projectId: project.id,
          role: "owner",
        },
      });

      return project;
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid project data",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Failed to create project",
    });
  }
};

// Get list of projects
export const getProjects = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: req.user!.userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};


// Get projects by ID
export const getProjectById = async (
  req: AuthRequest,
  res: Response
) => {
  try{
    const projectId = req.params.id;

    if (!projectId || Array.isArray(projectId)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    };

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: req.user!.userId,
          },
        },
      },
      include: {
        members: true,
        tasks: true
      },
    });
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects"
    });
  }
};


// Update projects
export const updateProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = req.params.id as string;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: req.user!.userId,
            role: "owner",
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const data = updatedProjectSchema.parse(req.body);

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
    });

    res.json(updatedProject);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid project data",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Failed to update project",
    });
  }
};


// Delete projects
export const deleteProject = async (
  req: AuthRequest,
  res: Response
) => {
  try{
    const projectId = req.params.id as string;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: req.user!.userId,
            role: "owner",
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    };

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    res.json({
      message: "Project deleted successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete project",
    });
  };
}