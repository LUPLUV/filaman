'use server'

import db from "@/db";
import {auditLogTable} from "@/db/schema";
import {desc} from "drizzle-orm";

export type LogAction = "new_filament_start" | "new_filament_end" | "update_filament" | "delete_filament" | "weight_filament";

export async function log(action: LogAction, rowId: number, newValues: string, oldValues: string, userId: number) {
    try {
        await db
            .insert(auditLogTable)
            .values({
                action,
                rowId,
                newValues,
                oldValues,
                userId
            })
    } catch (error) {
        console.error("Failed to log action:", error);
    }
}

export async function getAuditLogs() {
    return db.select().from(auditLogTable).orderBy(desc(auditLogTable.createdAt)).limit(100);
}