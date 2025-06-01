import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Filament, filamentsTable, SpoolTypes} from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildName(filament: Filament): string {
    return `${filament.type} ${filament.name?.length ?? 0 > 0 ? filament.name : filament.color}`
}

export function rawFilamentWeight(filament: Filament): number {
    return filament.restWeight - SpoolTypes[filament.spoolType ?? 0].spoolWeight
}

export function calculateRemainingFilament(filament: Filament): number {
    const filamentWeight = rawFilamentWeight(filament)
    const filamentFullWeight = SpoolTypes[filament.spoolType ?? 0].filamentWeight ?? 0
    const percentage = filamentWeight / filamentFullWeight * 100
    return percentage >= 98 ? 100 : percentage < 0 ? 0 : percentage
}

export function addFilamentId(filament: typeof filamentsTable.$inferInsert, filamentId: number) {
    return {
        id: filamentId,
        ...filament
    }
}