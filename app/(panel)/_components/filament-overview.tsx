"use client";

import {Filament, filamentsTable, spoolType, SpoolTypes} from "@/db/schema";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {getFilaments} from "@/actions/filaments";
import {CircleDot, Grid2X2, Grid3X3, LoaderCircle, Table2} from "lucide-react";
import {buildName, calculateRemainingFilament, cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {FilamentDetailsDialog} from "@/app/(panel)/_components/filament-details-dialog";
import {FilamentTable} from "@/app/(panel)/_components/filament-table/filament-table";
import {filamentTableColumns} from "@/app/(panel)/_components/filament-table/filament-table-columns";

export const FilamentOverview = () => {
    const [filaments, setFilaments] = useState<Filament[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("cards");
    const [search, setSearch] = useState("");

    const loadFilaments = async () => {
        const data = await getFilaments();
        setFilaments(data);
    };
    const onUpdate = () => {
        loadFilaments();
    }

    useEffect(() => {
        loadFilaments().then(() => setLoading(false));
    }, []);

    const filteredFilaments = () => {
        return filaments.filter((filament) => filament.name?.toLowerCase().includes(search.toLowerCase()) ?? true)
    }

    return loading ? (
        <div className="w-full mt-40 flex justify-center items-center">
            <LoaderCircle size={64} className="animate-spin"/>
        </div>
    ) : (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="bg-secondary p-1 flex gap-1 rounded-md">
                    <div onClick={() => setView("cards")}
                         className={cn("p-2 rounded-md cursor-pointer", view === "cards" && "bg-background")}><Grid2X2
                        size={16}/></div>
                    <div onClick={() => setView("cardsmd")}
                         className={cn("p-2 rounded-md cursor-pointer", view === "cardsmd" && "bg-background")}><Grid3X3
                        size={16}/></div>
                    <div onClick={() => setView("table")}
                         className={cn("p-2 rounded-md cursor-pointer", view === "table" && "bg-background")}><Table2
                        size={16}/></div>
                </div>
                <Input
                    placeholder="Suche nach Filament"
                    className="max-w-96 w-full"
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
            </div>
            {view === "cards" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFilaments().map((filament, index) => (
                        <FilamentCard key={index} filament={filament} onUpdate={onUpdate}
                                      showButtons size="lg"/>
                    ))}
                </div>
            )}
            {view === "cardsmd" && (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFilaments().map((filament, index) => (
                        <FilamentCard key={index} filament={filament} onUpdate={onUpdate}
                                      size="md"/>
                    ))}
                </div>
            )}
            {view === "table" && (
                <FilamentTable columns={filamentTableColumns} data={filteredFilaments()}/>
            )}
        </div>
    )
}

export const FilamentCard = ({filament, onUpdate, size}: {
    filament: typeof filamentsTable.$inferSelect;
    onUpdate?: () => void;
    showButtons?: boolean;
    size?: "sm" | "md" | "lg";
}) => {

    return (
        <FilamentDetailsDialog filament={filament}
                               onUpdate={() => onUpdate?.()}>
            <Card className={cn("relative overflow-hidden cursor-pointer", size === "lg" && "min-w-96")}>
                <CircleDot size={size === "lg" ? 128 : 100} color={filament.colorHex ? filament.colorHex : "#ffffff"}
                           className={cn("absolute -right-10", size === "lg" ? "top-12" : "top-16", filament.colorHex === "#ffffff" && "bg-black/60 dark:bg-none rounded-full", filament.colorHex === "#000000" && "dark:bg-white/60 bg-none rounded-full")}/>
                <CardHeader>
                    <CardTitle>{buildName(filament)}</CardTitle>
                    <CardDescription>{filament.type} - {filament.manufacturer}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p>Spule: <Badge>{spoolType(filament).name}</Badge></p>
                    <p>Farbe: <Badge>{filament.color}</Badge></p>
                    <p>Restgewicht: <Badge>{filament.restWeight - SpoolTypes[filament.spoolType ?? 0].spoolWeight}g</Badge>
                    </p>
                    <div className="relative flex">
                        <span
                            className="absolute text-xs font-semibold text-white z-40 left-2 mix-blend-difference">{calculateRemainingFilament(filament).toFixed(0)}%</span>
                        <Progress value={calculateRemainingFilament(filament)}/>
                    </div>
                </CardContent>
            </Card>
        </FilamentDetailsDialog>
    )
}