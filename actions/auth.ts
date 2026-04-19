"use server";

import db from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function login(prevState: any, formData: FormData) {
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!username || !password) {
        return { error: "Username and password are required" };
    }

    const users = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    const user = users[0];

    if (!user) {
        return { error: "Invalid credentials" };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return { error: "Invalid credentials" };
    }

    const session = await getSession();
    session.isLoggedIn = true;
    session.username = user.username;
    session.role = user.role;
    await session.save();

    redirect("/");
}

export async function logout() {
    const session = await getSession();
    session.destroy();
    redirect("/login");
}
