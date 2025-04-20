import {integer, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export type Filament = typeof filamentsTable.$inferSelect;

export const manufacturers = [
    "Prusament",
    "DasFilament"
]

export type SpoolType = {
    name: string;
    spoolWeight: number;
    filamentWeight: number;
    length?: number;
}

export const SpoolTypes: SpoolType[] = [
    {
        name: "Prusament 1 kg",
        spoolWeight: 200,
        filamentWeight: 1000,
        length: 1000
    },
    {
        name: "Prusament 2 kg",
        spoolWeight: 230,
        filamentWeight: 1000,
        length: 2000
    },
    {
        name: "DasFilament 800 g",
        spoolWeight: 215,
        filamentWeight: 800,
        length: 1000
    },
    {
        name: "DasFilament 2 kg",
        spoolWeight: 1000,
        filamentWeight: 1000,
        length: 2000
    }
]

export const filamentsTable = pgTable("filaments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    type: varchar({length: 255}),
    manufacturer: varchar(),
    spoolType: integer(),
    name: varchar({length: 255}),
    color: varchar({length: 255}),
    colorHex: varchar({length: 255}),
    colorPantone: varchar({length: 255}),
    diameter: integer(),
    weight: integer(),
    restWeight: integer().notNull(),
    status: varchar({length: 255}),
    openedAt: timestamp(),
    boughtAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
    emptyAt: timestamp(),
    link: varchar({length: 255}),
    code: uuid(),
    rfid1: varchar({length: 255}),
    rfid2: varchar({length: 255}),
});
