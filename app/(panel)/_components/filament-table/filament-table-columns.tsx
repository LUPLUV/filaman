"use client";

import {ColumnDef} from "@tanstack/table-core";
import {Filament, SpoolTypes} from "@/db/schema";
import {Progress} from "@/components/ui/progress";
import {buildName, calculateRemainingFilament, cn, formatDiameter, rawFilamentWeight} from "@/lib/utils";
import {FilamentDetailsDialog} from "@/app/(panel)/_components/filament-details-dialog";
import {Button} from "@/components/ui/button";

export const filamentTableColumns: ColumnDef<Filament>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => {
                const hex: string = row.getValue("colorHex") ?? "";
                return <span
                    className={cn("font-bold", hex === "#ffffff" && "bg-black/60 dark:bg-none rounded-full p-1", hex === "#000000" && "dark:bg-white/60 bg-none rounded-full p-1")}
                    style={{color: hex}}>{buildName(row.original)}</span>
            }
        },
        {
            accessorKey: "type",
            header: "Material",
        },
        {
            accessorKey: "spoolType",
            header: "Hersteller",
            cell: ({row}) => {
                return SpoolTypes[parseInt(row.getValue("spoolType"))].manufacturer
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
            accessorKey: "restWeight",
            header: "Restgewicht",
            cell: ({row}) => {
                return <span>{rawFilamentWeight(row.original)} g</span>
            }
        },
        {
            header: "Verbrauch",
            cell: ({row}) => {
                return <Progress
                    value={calculateRemainingFilament(row.original)}/>
            }
        },
        {
            id: "actions",
            header: "Aktionen",
            cell: ({row}) => {
                return <FilamentDetailsDialog filament={row.original}><Button size="sm">Details</Button></FilamentDetailsDialog>
            }
        }
    ]