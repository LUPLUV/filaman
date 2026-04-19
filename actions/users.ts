"use server"

import db from "@/db"
import { usersTable } from "@/db/schema"
import { eq, ne } from "drizzle-orm"
import { getSession } from "@/lib/session"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getUsers() {
    await requireAdmin();
    return db.select({
        id: usersTable.id,
        username: usersTable.username,
        role: usersTable.role,
        createdAt: usersTable.createdAt
    }).from(usersTable).orderBy(usersTable.id);
}

export async function createUser(data: any) {
    await requireAdmin();
    
    const existing = await db.select().from(usersTable).where(eq(usersTable.username, data.username)).limit(1);
    if (existing.length > 0) {
        throw new Error("Username already taken");
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    await db.insert(usersTable).values({
        username: data.username,
        password: hashedPassword,
        role: data.role
    });

    revalidatePath("/admin");
    return { success: true };
}

export async function updateUserRole(userId: number, newRole: string) {
    const session = await requireAdmin();
    
    const targetUser = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!targetUser.length) throw new Error("User not found");
    
    if (targetUser[0].username === session.username && newRole !== "admin") {
        throw new Error("You cannot remove your own admin privileges");
    }
    
    await db.update(usersTable).set({ role: newRole }).where(eq(usersTable.id, userId));
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteUser(userId: number) {
    const session = await requireAdmin();
    
    const targetUser = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!targetUser.length) throw new Error("User not found");
    
    if (targetUser[0].username === session.username) {
        throw new Error("You cannot delete yourself");
    }
    
    await db.delete(usersTable).where(eq(usersTable.id, userId));
    revalidatePath("/admin");
    return { success: true };
}
