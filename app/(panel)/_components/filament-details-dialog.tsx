"use client";

import {useState} from "react";
import {Filament, filamentsTable, SpoolTypes} from "@/db/schema";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FilamentTypes} from "@/lib/formSchema";
import {useToast} from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {deleteFilament, updateFilament} from "@/actions/filaments";
import {SelectSearch} from "@/components/ui/select-search";
import {ColorPicker} from "@/components/color-picker";
import {Save, Trash2} from "lucide-react";

// Create an EditFilamentSchema that includes all filament fields
const EditFilamentSchema = z.object({
    type: z.string(),
    manufacturer: z.string().optional(),
    spoolType: z.coerce.number().optional(),
    name: z.string().optional(),
    color: z.string().optional(),
    colorHex: z.string().optional(),
    colorPantone: z.string().optional(),
    diameter: z.coerce.number().default(175),
    weight: z.coerce.number().min(1, "Gewicht muss größer als 0 sein"),
    restWeight: z.coerce.number().optional(),
    status: z.string().optional(),
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
        const {toast} = useToast();

        const form = useForm<z.infer<typeof EditFilamentSchema>>({
            resolver: zodResolver(EditFilamentSchema),
            defaultValues: {
                type: filament.type!,
                manufacturer: filament.manufacturer || "",
                spoolType: filament.spoolType || 1,
                name: filament.name || "",
                color: filament.color || "",
                colorHex: filament.colorHex?.length ?? 0 > 0 ? filament.colorHex ?? "#ffffff" : "#ffffff",
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
            }
        });

        const onSubmit = async (values: z.infer<typeof EditFilamentSchema>) => {

            setProcessing(true);

            const filamentData: typeof filamentsTable.$inferInsert = {
                manufacturer: values.manufacturer,
                type: values.type,
                spoolType: values.spoolType,
                name: values.name,
                color: values.color,
                colorHex: values.colorHex,
                colorPantone: values.colorPantone,
                diameter: values.diameter,
                weight: values.weight,
                restWeight: values.restWeight ?? 0,
                status: values.status,
                openedAt: values.openedAt,
                boughtAt: values.boughtAt,
                emptyAt: values.emptyAt,
                createdAt: filament.createdAt,
                link: values.link,
                code: values.code,
                rfid1: values.rfid1,
                rfid2: values.rfid2
            };

            updateFilament(filament.id, filamentData)
                .then(() => {
                    setOpen(false);
                    toast({
                        title: "Filament aktualisiert",
                        description: `Du hast ${values.name} aktualisiert`,
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

                        <Form {...form}>
                            <form className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="spoolType"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Spulentyp</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value?.toString() ?? "1"}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {SpoolTypes.map((type, index) => (
                                                            <SelectItem key={index}
                                                                        value={index.toString()}>{type.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Material</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FilamentTypes.map((type) => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="restWeight"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Restgewicht</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" disabled={processing}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Farbe</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    options={[
                                                        "Transparent",
                                                        "Schwarz",
                                                        "Weiß",
                                                        "Blau",
                                                        "Grün",
                                                        "Rot",
                                                        "Orange",
                                                        "Pink",
                                                        "Gelb",
                                                        "Grau",
                                                        "Magenta",
                                                        "Andere"
                                                    ].map((color => ({
                                                        value: color,
                                                        label: color
                                                    })))}
                                                    placeholder="Farbe auswählen..."
                                                    searchPlaceholder="Farbe suchen..."
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pristine White"
                                                       className="placeholder:italic" {...field} disabled={processing}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="colorHex"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Hexcode</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-2">
                                                    <ColorPicker className="w-12" {...field} disabled={processing}/>
                                                    <Input {...field} disabled={processing}/>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="rfid1"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>RFID 1</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="rfid2"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>RFID 2</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>

                        <DialogFooter className="w-full flex justify-between">
                            <Button
                                variant="destructive"
                                onClick={deleteFilamentLogic}
                                disabled={processing}
                                size="icon"
                            >
                                <Trash2/>
                            </Button>
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={processing}
                                size="icon"
                            >
                                <Save/>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
;