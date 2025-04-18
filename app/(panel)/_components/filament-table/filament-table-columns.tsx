"use client";

import {ColumnDef} from "@tanstack/table-core";
import {Filament, Manufacturer} from "@/db/schema";
import {Progress} from "@/components/ui/progress";
import {cn, formatDiameter} from "@/lib/utils";

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
            header: "Durchmesser",
            cell: ({row}) => {
                const diameter = parseInt(row.getValue("diameter"));
                return <span>{formatDiameter(diameter)} mm</span>
            }
        },
        {
            accessorKey: "weight",
            header: "Vollgewicht",
            cell: ({row}) => {
                const weight = parseInt(row.getValue("weight"));
                return <span>{weight} g</span>
            }
        },
        {
            accessorKey: "restWeight",
            header: "Restgewicht",
            cell: ({row}) => {
                const restWeight = parseInt(row.getValue("restWeight"));
                return <span>{restWeight} g</span>
            }
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            header: "Verbrauch",
            cell: ({row}) => {
                const restWeight = parseInt(row.getValue("restWeight"));
                const weight = parseInt(row.getValue("weight"));
                return <Progress
                    value={restWeight / weight * 100}/>
            }
        }
    ];
}