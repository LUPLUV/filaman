'use server'

import db from '@/db/index'
import {manufacturersTable} from "@/db/schema"

export async function createManufacturer(manufacturer: typeof manufacturersTable.$inferInsert) {
    try {
        await db
            .insert(manufacturersTable)
            .values(manufacturer)

        return { success: true }
    } catch {
        return { success: false, error: 'Failed to update filament' }
    }
}

export async function getManufacturers() {
    return db.select().from(manufacturersTable).orderBy(manufacturersTable.createdAt)
}