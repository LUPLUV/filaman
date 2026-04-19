import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from './schema';
import bcrypt from 'bcryptjs';

const db = drizzle(process.env.DATABASE_URL!);

(async () => {
    try {
        const existingUser = await db.select().from(usersTable).limit(1);
        if (existingUser.length === 0) {
            const hashedPassword = await bcrypt.hash("admin", 10);
            await db.insert(usersTable).values({
                username: "admin",
                password: hashedPassword,
                role: "admin",
            });
            console.log("Seeded default admin user.");
        }
    } catch (e) {
        console.error("Failed to seed admin user. Make sure DB is migrated first.", e);
    }
})();

export default db;