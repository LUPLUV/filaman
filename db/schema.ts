import {integer, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import db from "@/db/index";
import {eq} from "drizzle-orm";

export type Filament = typeof filamentsTable.$inferSelect;
export type Manufacturer = typeof manufacturersTable.$inferSelect;
export type User = typeof userTable.$inferSelect;

export const getUserFromDB = async (username: string, passwordHash: string): Promise<User | null> => {
    const user = await db.select().from(userTable).where(eq(userTable.username, username)).limit(1);

    if (user.length === 0 || user[0].passwordHash !== passwordHash) {
        return null;
    }

    return user[0];
}

export const userTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 255 }).notNull(),
    passwordHash: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})

export const manufacturersTable = pgTable("manufacturers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    qualityScore: integer(),
    link: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
});

export const filamentsTable = pgTable("filaments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    type: varchar({ length: 255 }),
    manufacturerId: integer().references(() => manufacturersTable.id),
    name: varchar({ length: 255 }),
    color: varchar({ length: 255 }),
    colorHex: varchar({ length: 255 }),
    colorPantone: varchar({ length: 255 }),
    diameter: integer(),
    weight: integer(),
    restWeight: integer().notNull(),
    status: varchar({ length: 255 }),
    openedAt: timestamp(),
    boughtAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
    emptyAt: timestamp(),
    link: varchar({ length: 255 }),
    code: uuid(),
    rfid1: varchar({ length: 255 }),
    rfid2: varchar({ length: 255 }),
});
