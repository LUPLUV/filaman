import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
    isLoggedIn: boolean;
    username: string;
    role: string;
};

export const sessionOptions = {
    password: process.env.SESSION_PASSWORD || "a_default_password_that_is_at_least_32_characters_long",
    cookieName: "filaman_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    return session;
}
