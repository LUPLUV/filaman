import {integer, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export type Filament = typeof filamentsTable.$inferSelect;

export const manufacturers = [
    "Prusament",
    "DasFilament"
]

export const filamentsTable = pgTable("filaments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    type: varchar({ length: 255 }),
    manufacturer: varchar(),
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
