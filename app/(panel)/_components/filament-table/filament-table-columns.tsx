"use client";

import {ColumnDef} from "@tanstack/table-core";
import {Filament, Manufacturer} from "@/db/schema";
import {Progress} from "@/components/ui/progress";
import {cn} from "@/lib/utils";

export const filamentTableColumns = (manufacturers: Manufacturer[]): ColumnDef<Filament>[] => {
    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => {
                const hex: string = row.getValue("colorHex") ?? "";
                return <span
                    className={cn("font-bold", hex === "#ffffff" && "bg-black/60 dark:bg-none rounded-full p-1", hex === "#000000" && "dark:bg-white/60 bg-none rounded-full p-1")}
                    style={{color: hex}}>{row.getValue("name")}</span>
            }
        },
        {
            accessorKey: "type",
            header: "Material",
        },
        {
            accessorKey: "manufacturerId",
            header: "Hersteller",
            cell: ({row}) => {
                const manufacturer = manufacturers.find(({id}) => id === parseInt(row.getValue("manufacturerId")));
                return <span>{manufacturer?.name ?? "Nicht gefunden"}</span>
            }
        },
        {
            accessorKey: "color",
            header: "Farbe",
        },
        {
            accessorKey: "colorHex",
            header: "Farbe (hex)",
        },
        {
            accessorKey: "diameter",
            header: "Durchmesser (mm)",
        },
        {
            accessorKey: "weight",
            header: "Vollgewicht (g)",
        },
        {
            accessorKey: "restWeight",
            header: "Restgewicht (g)",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            header: "Verbraucht",
            cell: ({row}) => {
                return <Progress
                    value={row.getValue("restWeight") ?? 1 / (parseFloat(row.getValue("weight")) ?? 10) * 100}/>
            }
        }
    ];
}