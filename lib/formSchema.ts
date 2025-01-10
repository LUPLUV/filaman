import {z} from "zod";

export const UsageSchema = z.object({
    usedWeight: z.coerce.number(),
    usedAt: z.date(),
})

export const FilamentTypes = ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon', 'PC', 'Wood', 'Metal', 'Other']
export const FilamentStatus = ['CLOSED', 'OPENED', 'EMPTY']

export const CreateFilamentSchema = z.object({
    type: z.string(),
    manufacturerId: z.coerce.number(),
    name: z.string(),
    color: z.string(),
    colorHex: z.string().optional(),
    colorPantone: z.string().optional(),
    weight: z.coerce.number(),
    restWeight: z.coerce.number().optional(),
    status: z.string(),
    openedAt: z.date().optional(),
    boughtAt: z.date().optional(),
    emptyAt: z.date().optional(),
    link: z.string().url().optional(),
})