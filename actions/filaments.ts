'use server'

import db from '@/db/index'
import {Filament, filamentsTable} from "@/db/schema"
import {eq, or} from "drizzle-orm"

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
        const spool = await getFilamentByRfid(rfid);
        if(spool) {
            await db
                .update(filamentsTable)
                .set({
                    restWeight: restWeight
                })
                .where(or(eq(filamentsTable.rfid1, rfid), eq(filamentsTable.rfid2, rfid)));
            return { success: true }
        }
        // Create new spool
        /*
        const newSpool: Filament = {
            rfid1: rfid,
            createdAt: new Date(),
        }

        await db
            .insert(filamentsTable)
            .values(newSpool)

         */

        return { success: true }
    } catch {
        return { success: false, error: 'Failed to update filament' }
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