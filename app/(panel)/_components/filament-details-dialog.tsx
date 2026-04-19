"use client";

import { useState } from "react";
import { Filament, filamentsTable, SpoolTypes } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { FilamentTypes } from "@/lib/formSchema";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteFilament, updateFilament } from "@/actions/filaments";
import { SelectSearch } from "@/components/ui/select-search";
import { ColorPicker } from "@/components/color-picker";
import { Save, Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";

const EditFilamentSchema = z.object({
    type: z.string(),
    manufacturer: z.string(),
    spoolType: z.coerce.number().optional(),
    name: z.string().optional(),
    color: z.string().optional(),
    colorHex: z.string(),
    colorPantone: z.string(),
    diameter: z.coerce.number(),
    weight: z.coerce.number().min(1, "Gewicht muss größer als 0 sein"),
    restWeight: z.coerce.number(),
    status: z.string(),
    openedAt: z.date().optional(),
    boughtAt: z.date().optional(),
    emptyAt: z.date().optional(),
    link: z.string().optional(),
    code: z.string().optional(),
    rfid1: z.string().optional(),
    rfid2: z.string().optional()
});

export const FilamentDetailsDialog = ({
    filament,
    onUpdate,
    children
}: {
    filament: Filament;
    onUpdate?: () => void;
    children: React.ReactNode
}) => {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { toast } = useToast();

    const form = useForm({
        validators: {
            onSubmit: EditFilamentSchema
        },
        defaultValues: {
            type: filament.type || "PLA",
            manufacturer: filament.manufacturer || "",
            spoolType: filament.spoolType ?? undefined,
            name: filament.name || undefined,
            color: filament.color || undefined,
            colorHex: filament.colorHex?.length && filament.colorHex?.length > 0 ? filament.colorHex : "#ffffff",
            colorPantone: filament.colorPantone || "",
            diameter: filament.diameter || 750,
            weight: filament.weight || 1200,
            restWeight: filament.restWeight,
            status: filament.status || "OPENED",
            openedAt: filament.openedAt || undefined,
            boughtAt: filament.boughtAt || undefined,
            emptyAt: filament.emptyAt || undefined,
            link: filament.link || undefined,
            code: filament.code || undefined,
            rfid1: filament.rfid1 || undefined,
            rfid2: filament.rfid2 || undefined
        } as z.infer<typeof EditFilamentSchema>,
        onSubmit: async ({ value }) => {
            setProcessing(true);

            const filamentData: typeof filamentsTable.$inferInsert = {
                type: value.type,
                manufacturer: value.manufacturer,
                spoolType: value.spoolType,
                name: value.name,
                color: value.color,
                colorHex: value.colorHex,
                colorPantone: value.colorPantone,
                diameter: value.diameter,
                weight: value.weight,
                restWeight: value.restWeight ?? 0,
                status: value.status,
                openedAt: value.openedAt,
                boughtAt: value.boughtAt,
                emptyAt: value.emptyAt,
                createdAt: filament.createdAt,
                link: value.link,
                code: value.code,
                rfid1: value.rfid1,
                rfid2: value.rfid2
            };

            updateFilament(filament.id, filamentData)
                .then(() => {
                    setOpen(false);
                    toast({
                        title: "Filament aktualisiert",
                        description: `Du hast ${value.name} aktualisiert`,
                    });
                    onUpdate?.();
                })
                .catch((error) => {
                    console.error(error);
                    toast({
                        title: "Fehler",
                        description: "Filament konnte nicht aktualisiert werden",
                        variant: "destructive"
                    });
                })
                .finally(() => {
                    setProcessing(false);
                });
        }
    });

    const deleteFilamentLogic = async () => {
        setProcessing(true);
        deleteFilament(filament.id)
            .then(() => {
                toast({
                    title: "Filament gelöscht",
                    description: `Du hast ${filament.name} gelöscht`,
                })
                setOpen(false)
                onUpdate?.()
            })
            .catch(() => {
                toast({
                    title: "Error",
                    description: "Filament konnte nicht gelöscht werden",
                    variant: "destructive"
                })
            });
    }

    return (
        <div>
            <div onClick={() => setOpen(true)}>
                {children}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl max-h-screen overflow-scroll">
                    <DialogHeader>
                        <DialogTitle>Filament Details</DialogTitle>
                        <DialogDescription>{filament.name} - #{filament.id}</DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        <form.Field
                            name="spoolType"
                            validators={{ onChange: EditFilamentSchema.shape.spoolType }}
                            children={(field) => (
                                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                    <FormLabel>Spulentyp {field.state.value}</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(val) => field.handleChange(val ? Number(val) : undefined as any)}
                                            value={field.state.value?.toString() ?? ""}
                                            disabled={processing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Spulentyp auswählen..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SpoolTypes.map((type, index) => (
                                                    <SelectItem key={index} value={index.toString()}>{type.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <form.Field
                            name="type"
                            validators={{ onChange: EditFilamentSchema.shape.type }}
                            children={(field) => (
                                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                    <FormLabel>Material</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.handleChange}
                                            value={field.state.value ?? ""}
                                            disabled={processing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Material auswählen..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FilamentTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <form.Field
                            name="restWeight"
                            validators={{ onChange: EditFilamentSchema.shape.restWeight }}
                            children={(field) => (
                                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                    <FormLabel>Restgewicht</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            name={field.name}
                                            value={field.state.value ?? ""}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : 0)}
                                            disabled={processing}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <form.Field
                            name="color"
                            validators={{ onChange: EditFilamentSchema.shape.color }}
                            children={(field) => (
                                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                    <FormLabel>Farbe</FormLabel>
                                    <FormControl>
                                        <SelectSearch
                                            value={field.state.value ?? ""}
                                            onValueChange={field.handleChange}
                                            options={[
                                                "Transparent", "Schwarz", "Weiß", "Blau",
                                                "Grün", "Rot", "Orange", "Pink", "Gelb",
                                                "Grau", "Magenta", "Andere"
                                            ].map((color => ({ value: color, label: color })))}
                                            placeholder="Farbe auswählen..."
                                            searchPlaceholder="Farbe suchen..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <form.Field
                            name="name"
                            validators={{ onChange: EditFilamentSchema.shape.name }}
                            children={(field) => (
                                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            name={field.name}
                                            value={field.state.value ?? ""}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Pristine White"
                                            className="placeholder:italic"
                                            disabled={processing}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <form.Field
                            name="colorHex"
                            validators={{ onChange: EditFilamentSchema.shape.colorHex }}
                            children={(field) => (
                                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                    <FormLabel>Hexcode</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <ColorPicker
                                                className="w-12"
                                                color={field.state.value ?? "#ffffff"}
                                                onChange={field.handleChange}
                                                disabled={processing}
                                            />
                                            <Input
                                                name={field.name}
                                                value={field.state.value ?? ""}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                disabled={processing}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <form.Field
                            name="rfid1"
                            validators={{ onChange: EditFilamentSchema.shape.rfid1 }}
                            children={(field) => (
                                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                    <FormLabel>RFID 1</FormLabel>
                                    <FormControl>
                                        <Input
                                            name={field.name}
                                            value={field.state.value ?? ""}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <form.Field
                            name="rfid2"
                            validators={{ onChange: EditFilamentSchema.shape.rfid2 }}
                            children={(field) => (
                                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                    <FormLabel>RFID 2</FormLabel>
                                    <FormControl>
                                        <Input
                                            name={field.name}
                                            value={field.state.value ?? ""}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="w-full flex justify-between col-span-full mt-4">
                            <DeleteDialog title="Spule löschen?" description="Bist du dir sicher dass du diese Spule löschen willst?" onDelete={deleteFilamentLogic}>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    Löschen
                                    <Trash2 />
                                </Button>
                            </DeleteDialog>

                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                                children={([canSubmit, isSubmitting]) => (
                                    <Button
                                        type="submit"
                                        disabled={processing || !canSubmit || isSubmitting}
                                    >
                                        {isSubmitting ? 'Speichern...' : 'Speichern'}
                                        <Save />
                                    </Button>
                                )}
                            />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};