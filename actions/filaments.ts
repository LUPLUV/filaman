'use server'

import db from '@/db/index'
import { filamentsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

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

export async function getFilaments() {
    return db.select().from(filamentsTable).orderBy(filamentsTable.createdAt)
}

export async function getFilamentByCode(code: string) {
    return db.select().from(filamentsTable).where(eq(filamentsTable.code, code))
}