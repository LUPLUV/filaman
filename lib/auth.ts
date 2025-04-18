import NextAuth from "next-auth"
import Credentials from "@auth/core/providers/credentials";
import {saltAndHashPassword} from "@/lib/password";
import {getUserFromDB} from "@/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                // logic to salt and hash password
                const pwHash = saltAndHashPassword(credentials.password as string)

                // logic to verify if the user exists
                getUserFromDB(credentials.username as string, pwHash)
                    .then((user) => {
                        if (!user) {
                            // No user found, so this is their first attempt to login
                            // Optionally, this is also the place you could do a user registration
                        }
                        return user
                    })
                throw new Error("Invalid credentials.")
            },
        }),
    ],
})