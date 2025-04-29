'use server'

import db from '@/db/index'
import {filamentsTable} from "@/db/schema"
import {eq, or, isNull} from "drizzle-orm"
import {log} from "@/actions/audit-log";
import {addFilamentId} from "@/lib/utils";

export async function deleteFilament(filamentId: number) {
    try {
        const oldData = await getFilamentById(filamentId);
        await db
            .delete(filamentsTable)
            .where(eq(filamentsTable.id, filamentId))
        await log("delete_filament", oldData[0].id, "{}", JSON.stringify(oldData[0]), 1);
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
        const oldData = await getFilamentByRfid(filament.rfid1 ?? "");
        await db
            .update(filamentsTable)
            .set(filament)
            .where(eq(filamentsTable.id, filamentId));
        await log("update_filament", oldData[0].id, JSON.stringify(addFilamentId(filament, filamentId)), JSON.stringify(oldData[0]), 1);
        return { success: true }
    } catch(error) {
        return { success: false, error: 'Failed to update filament', details: error }
    }
}

export async function setRestFilament(
    rfid: string,
    restWeight: number
) {
    try {
        // Check if filament exists
        const spool = await getFilamentByRfid(rfid);
        if(spool.length > 0) {
            const newValues = {...spool[0], restWeight: restWeight};
            await db
                .update(filamentsTable)
                .set({
                    restWeight: restWeight
                })
                .where(eq(filamentsTable.id, spool[0].id));
            await log("weight_filament", spool[0].id, JSON.stringify(newValues), JSON.stringify(spool[0]), 1);
            return { success: true }
        }

        const missingRfid = await getFilamentWithMissingRfid();
        if(missingRfid.length > 0) {
            const newValues = {...spool[0], rfid2: rfid, restWeight: restWeight};
            await db
                .update(filamentsTable)
                .set({
                    rfid2: rfid,
                    restWeight: restWeight
                })
                .where(eq(filamentsTable.id, missingRfid[0].id));
            await log("new_filament_end", missingRfid[0].id, JSON.stringify(newValues), JSON.stringify(missingRfid[0]), 1);
            return { success: true }
        }
        // Create new spool
        const newSpool: typeof filamentsTable.$inferInsert = {
            rfid1: rfid,
            restWeight: restWeight,
            createdAt: new Date(),
        }

        await db
            .insert(filamentsTable)
            .values(newSpool);
        const createdSpool = await getFilamentByRfid(rfid);
        await log("new_filament_start", createdSpool[0].id, JSON.stringify(createdSpool[0]), "{}", 1);
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

export async function getFilamentById(id: number) {
    return db.select().from(filamentsTable).where(eq(filamentsTable.id, id))
}
