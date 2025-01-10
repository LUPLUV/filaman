'use server'

import db from '@/db/index'
import { filamentsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function updateUsedFilament(
    filamentId: number,
    usedWeight: number,
    currentWeight: number
) {
    try {
        await db
            .update(filamentsTable)
            .set({
                restWeight: currentWeight - usedWeight
            })
            .where(eq(filamentsTable.id, filamentId))

        return { success: true }
    } catch {
        return { success: false, error: 'Failed to update filament' }
    }
}

export async function getFilaments() {
    return db.select().from(filamentsTable).orderBy(filamentsTable.createdAt)
}