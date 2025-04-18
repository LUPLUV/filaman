'use server'

import db from '@/db/index'
import {filamentsTable} from "@/db/schema"
import {eq, or, isNull} from "drizzle-orm"

export async function createFilament(filament: typeof filamentsTable.$inferInsert) {
    try {
        await db
            .insert(filamentsTable)
            .values(filament)

        return { success: true }
    } catch {
        return { success: false, error: 'Failed to create filament' }
    }
}

export async function deleteFilament(filamentId: number) {
    try {
        await db
            .delete(filamentsTable)
            .where(eq(filamentsTable.id, filamentId))

        return { success: true }
    } catch {
        return { success: false, error: 'Failed to delete filament' }
    }
}

export async function updateFilament(
    filamentId: number,
    filament: typeof filamentsTable.$inferInsert
) {
    try {
        console.log("Trying update", filamentId, filament);
        await db
            .update(filamentsTable)
            .set(filament)
            .where(eq(filamentsTable.id, filamentId));
        console.log("Updated filament with ID:", filamentId, "to", filament);

        return { success: true }
    } catch(error) {
        return { success: false, error: 'Failed to update filament', details: error }
    }
}

export async function updateUsedFilament(
    filamentId: number,
    currentWeight: number,
    usedWeight?: number,
    restWeight?: number
) {
    try {
        if (usedWeight && restWeight === undefined) {
            restWeight = currentWeight - usedWeight
        }
        await db
            .update(filamentsTable)
            .set({
                restWeight: restWeight
            })
            .where(eq(filamentsTable.id, filamentId))

        return { success: true }
    } catch {
        return { success: false, error: 'Failed to update filament' }
    }
}

export async function setRestFilament(
    rfid: string,
    restWeight: number
) {
    try {
        console.log("Setting rest weight for filament with RFID:", rfid, "to", restWeight);
        // Check if filament exists
        const spool = await getFilamentByRfid(rfid);
        if(spool.length > 0) {
            console.log("Found spool with RFID:", rfid, " SPool:", spool);
            await db
                .update(filamentsTable)
                .set({
                    restWeight: restWeight
                })
                .where(eq(filamentsTable.id, spool[0].id));
            return { success: true }
        }

        const missingRfid = await getFilamentWithMissingRfid();
        if(missingRfid.length > 0) {
            console.log("Found spool with missing RFID:", missingRfid[0]);
            await db
                .update(filamentsTable)
                .set({
                    rfid2: rfid,
                    restWeight: restWeight
                })
                .where(eq(filamentsTable.id, missingRfid[0].id));
            return { success: true }
        }
        // Create new spool
        const newSpool: typeof filamentsTable.$inferInsert = {
            rfid1: rfid,
            restWeight: restWeight,
            createdAt: new Date(),
        }

        console.log("Creating new spool with RFID:", rfid, " SPool:", newSpool);

        await db
            .insert(filamentsTable)
            .values(newSpool);
        return { success: true }
    } catch {
        throw new Error('Failed to set rest weight for filament')
    }
}

export async function getFilaments() {
    return db.select().from(filamentsTable).orderBy(filamentsTable.createdAt)
}

export async function getFilamentByCode(code: string) {
    return db.select().from(filamentsTable).where(eq(filamentsTable.code, code))
}

export async function getFilamentByRfid(rfid: string) {
    return db.select().from(filamentsTable).where(or(eq(filamentsTable.rfid1, rfid), eq(filamentsTable.rfid2, rfid)))
}

export async function getFilamentWithMissingRfid() {
    return db.select().from(filamentsTable).where(isNull(filamentsTable.rfid2))
}