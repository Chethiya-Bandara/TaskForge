import { Response } from "express";
import prisma from "../prisma/client.js";
import { AuthRequest } from "../types/auth";
import { addProjectMemberSchema } from "../validators/project_member_validator";


// Add new member
export const addMember = async(
    req: AuthRequest,
    res: Response
) => {
    try{
        const projectId = req.params.id as string;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isOwner = await prisma.projectMember.findFirst({
            where: {
                projectId,
                userId: req.user!.userId,
                role: "owner",
            },
        });

        if (!isOwner) {
            return res.status(403).json({
                message: "Only the project owner can manage members",
            });
        }
        const data = addProjectMemberSchema.parse(req.body);
        const { email, role } = data;

        const safeRole = role && ["member", "owner"].includes(role)
        ? role
        : "member";
        
        // Find user
        const user = await prisma.user.findUnique({
            where: {
                email
            },
        });

        // return error if user doesnt exist
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            })
        };

        // Check if user already in project
        const existing = await prisma.projectMember.findFirst({
            where: {
                userId: user.id,
                projectId,
            },
        });

        if(existing){
            return res.status(400).json({ 
                message: "Already a member" 
            });
        };

        // Add member to project
        const member = await prisma.projectMember.create({
            data: {
                userId: user.id,
                projectId,
                role: safeRole,
            },
            include: {
                user: true,
            },
        });

        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({
            message: "Failed to add member",
        });
    };
};

// Get project members
export const getMembers = async(
    req: AuthRequest,
    res: Response
) => {
    try{
        const projectId = req.params.id as string;

        const membership = await prisma.projectMember.findFirst({
        where: {
            projectId,
            userId: req.user!.userId,
        },
        });

        if (!membership) {
        return res.status(403).json({
            message: "Forbidden",
        });
        }

        const members = await prisma.projectMember.findMany({
            where: { projectId },
            include: {
                user: true,
            },
        });
        res.json(members);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get members",
        });
    };
};

export const deleteMember = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const projectId = req.params.id as string;
        const isOwner = await prisma.projectMember.findFirst({
        where: {
            projectId,
            userId: req.user!.userId,
            role: "owner",
        },
        });

        if (!isOwner) {
        return res.status(403).json({
            message: "Only the project owner can manage members",
        });
        }
        const userId = req.params.userId as string;

        const projectExists = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!projectExists) {
            return res.status(404).json({ message: "Project not found" });
        };

        const member = await prisma.projectMember.findFirst({
            where: {
                projectId,
                userId,
            },
        });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        if (member.role === "owner") {
            return res.status(400).json({
                message: "Cannot remove project owner",
            });
        }

        await prisma.projectMember.deleteMany({
            where: {
                projectId,
                userId,
            },
        });

        res.json({ message: "Member removed successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete member",
        });
    };
}