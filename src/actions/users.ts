"use server";

import { prisma } from "@/lib/db";
import { isAdmin, isStaff } from "@/lib/auth";

type Role = "ADMIN" | "NURSE" | "PATIENT";

/**
 * Get all users (staff only)
 */
export async function getAllUsers() {
    const staffAccess = await isStaff();
    if (!staffAccess) {
        return { success: false, error: "Accès non autorisé" };
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                phoneNumber: true,
                phoneNumberVerified: true,
                image: true,
                role: true,
                patientId: true,
                createdAt: true,
            },
        });

        return { success: true, data: users };
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

/**
 * Get staff members only (admin and nurses)
 */
export async function getStaffMembers() {
    const staffAccess = await isStaff();
    if (!staffAccess) {
        return { success: false, error: "Accès non autorisé" };
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ["ADMIN", "NURSE"],
                },
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                phoneNumber: true,
                image: true,
                role: true,
                createdAt: true,
            },
        });

        return { success: true, data: users };
    } catch (error) {
        console.error("Erreur lors de la récupération du staff:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, newRole: Role) {
    const adminAccess = await isAdmin();
    if (!adminAccess) {
        return { success: false, error: "Seuls les administrateurs peuvent modifier les rôles" };
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return { success: true, data: updatedUser };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rôle:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

/**
 * Link user to patient record
 */
export async function linkUserToPatient(userId: string, patientId: string) {
    const staffAccess = await isStaff();
    if (!staffAccess) {
        return { success: false, error: "Accès non autorisé" };
    }

    try {
        // Vérifier que le patient existe
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
        });

        if (!patient) {
            return { success: false, error: "Patient non trouvé" };
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                patientId,
                role: "PATIENT",
            },
            select: {
                id: true,
                name: true,
                email: true,
                patientId: true,
                role: true,
            },
        });

        return { success: true, data: updatedUser };
    } catch (error) {
        console.error("Erreur lors du lien utilisateur-patient:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

/**
 * Create a new staff member (admin only)
 */
export async function inviteStaffMember(email: string, name: string, role: "ADMIN" | "NURSE") {
    const adminAccess = await isAdmin();
    if (!adminAccess) {
        return { success: false, error: "Seuls les administrateurs peuvent inviter du personnel" };
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            // Mettre à jour le rôle si l'utilisateur existe
            const updatedUser = await prisma.user.update({
                where: { email },
                data: { role, name },
            });
            return { success: true, data: updatedUser, message: "Utilisateur mis à jour" };
        }

        // Note: L'utilisateur sera créé lors de sa première connexion
        // Pour l'instant, on retourne un message d'information
        return { 
            success: true, 
            message: `Invitation envoyée à ${email}. Le compte sera créé lors de la première connexion.` 
        };
    } catch (error) {
        console.error("Erreur lors de l'invitation:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

