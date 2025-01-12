import {integer, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export type Filament = typeof filamentsTable.$inferSelect;
export type Manufacturer = typeof manufacturersTable.$inferSelect;

export const manufacturersTable = pgTable("manufacturers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    qualityScore: integer(),
    link: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
});

export const filamentsTable = pgTable("filaments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    type: varchar({ length: 255 }).notNull(),
    manufacturerId: integer().references(() => manufacturersTable.id).notNull(),
    name: varchar({ length: 255 }).notNull(),
    color: varchar({ length: 255 }).notNull(),
    colorHex: varchar({ length: 255 }),
    colorPantone: varchar({ length: 255 }),
    diameter: integer(),
    weight: integer().notNull(),
    restWeight: integer().notNull(),
    status: varchar({ length: 255 }).notNull(),
    openedAt: timestamp(),
    boughtAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
    emptyAt: timestamp(),
    link: varchar({ length: 255 }),
    code: uuid(),
});
