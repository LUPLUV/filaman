"use client";

import {useState} from "react";
import {Filament, filamentsTable, manufacturers} from "@/db/schema";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FilamentStatus, FilamentTypes} from "@/lib/formSchema";
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
import {DatePicker} from "@/app/(panel)/_components/date-picker";
import {updateFilament} from "@/actions/filaments";

// Create an EditFilamentSchema that includes all filament fields
const EditFilamentSchema = z.object({
    type: z.string(),
    manufacturer: z.string().optional(),
    name: z.string().min(1, "Name ist erforderlich"),
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
                                                onUpdate
                                            }: {
        filament: Filament;
        onUpdate?: () => void;
    }) => {
        const [open, setOpen] = useState(false);
        const [processing, setProcessing] = useState(false);
        const {toast} = useToast();

        const form = useForm<z.infer<typeof EditFilamentSchema>>({
            resolver: zodResolver(EditFilamentSchema),
            defaultValues: {
                type: filament.type!,
                manufacturer: filament.manufacturer || "",
                name: filament.name || "",
                color: filament.color || "",
                colorHex: filament.colorHex || "",
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
                type: values.type,
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

        return (
            <>
                <Button variant="secondary" onClick={() => setOpen(true)}>
                    Details
                </Button>

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
                                    name="type"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Filament Art</FormLabel>
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
                                    name="manufacturer"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Hersteller</FormLabel>
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
                                                        {manufacturers.map((manufacturer) => (
                                                            <SelectItem
                                                                key={manufacturer}
                                                                value={manufacturer}
                                                            >
                                                                {manufacturer}
                                                            </SelectItem>
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
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={processing}/>
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
                                                <Input {...field} disabled={processing}/>
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
                                                <Input {...field} disabled={processing}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="colorPantone"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Pantone</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={processing}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="diameter"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Durchmesser</FormLabel>
                                            <FormControl>
                                                <Select defaultValue={"175"} onValueChange={field.onChange}
                                                        value={field.value?.toString() ?? undefined} disabled={processing}>
                                                    <SelectTrigger>
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={"100"}>1.00 mm</SelectItem>
                                                        <SelectItem value={"175"}>1.75 mm</SelectItem>
                                                        <SelectItem value={"300"}>3.00 mm</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Gewicht (volle Spule)</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" disabled={processing}/>
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
                                            <FormLabel>Rest Gewicht</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" disabled={processing}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
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
                                                        {FilamentStatus.map((status) => (
                                                            <SelectItem key={status} value={status}>{status}</SelectItem>
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
                                    name="openedAt"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Geöffnet am</FormLabel>
                                            <FormControl>
                                                <DatePicker onValueChange={field.onChange} value={field.value}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="boughtAt"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Gekauft am</FormLabel>
                                            <FormControl>
                                                <DatePicker onValueChange={field.onChange} value={field.value}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="emptyAt"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Leer am</FormLabel>
                                            <FormControl>
                                                <DatePicker onValueChange={field.onChange} value={field.value}/>
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

                        <DialogFooter>
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={processing}
                            >
                                Speichern
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
;