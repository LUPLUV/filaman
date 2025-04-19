"use client";

import {Filament, filamentsTable, manufacturers} from "@/db/schema";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {CreateFilamentSchema, FilamentStatus, FilamentTypes, UsageSchema} from "@/lib/formSchema";
import {useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {createFilament, deleteFilament, getFilaments, updateUsedFilament} from "@/actions/filaments";
import {CheckCircle, CircleDot, Grid2X2, Grid3X3, LoaderCircle, Table2, Trash} from "lucide-react";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Scanner} from "@yudiel/react-qr-scanner";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {DatePicker} from "@/app/(panel)/_components/date-picker";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
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
        return filaments.filter((filament) => filament.name?.toLowerCase().includes(search.toLowerCase()))
    }

    return loading ? (
        <div className="w-full mt-40 flex justify-center items-center">
            <LoaderCircle size={64} className="animate-spin"/>
        </div>
    ) : (
        <div className="space-y-4">
            <div className="flex w-fit gap-4">
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
                    className="w-96"
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
                    <AddFilamentCard onUpdate={onUpdate}/>
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

const AddFilamentCard = ({onUpdate}: { onUpdate?: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState<string>();
    const [step, setStep] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    const {toast} = useToast();

    const form = useForm<z.infer<typeof CreateFilamentSchema>>({
        resolver: zodResolver(CreateFilamentSchema),
        defaultValues: {
            type: "PLA",
            manufacturer: manufacturers[0],
            name: "",
            color: "",
            diameter: 175,
            weight: 0,
            status: "OPENED",
        }
    })

    useEffect(() => {
        if (step == 1) {
            navigator.mediaDevices.enumerateDevices()
                .then(availableDevices => {
                    const videoDevices = availableDevices.filter(
                        device => device.kind === 'videoinput'
                    );
                    setDevices(videoDevices);
                    setHasPermission(videoDevices.length > 0);
                })
                .catch(err => {
                    console.error("Error getting devices:", err);
                    setError(err.message);
                });
        }
    }, [step]);

    const handleScan = async (data: string) => {
        try {
            form.setValue("code", data);
            setStep(2);
        } catch (error) {
            console.error("Scan error:", error);
            setError("Failed to process QR code");
        }
    };

    const onSubmit = async (values: z.infer<typeof CreateFilamentSchema>) => {
        try {
            setProcessing(true)

            console.log(values)

            const result = await createFilament({
                type: values.type,
                manufacturer: values.manufacturer,
                name: values.name,
                color: values.color,
                colorHex: values.colorHex,
                colorPantone: values.colorPantone,
                diameter: values.diameter,
                weight: values.weight,
                restWeight: values.restWeight ?? values.weight,
                status: values.status,
                openedAt: values.openedAt,
                boughtAt: values.boughtAt,
                emptyAt: values.emptyAt,
                link: values.link,
                code: values.code,
            })

            if (!result.success) {
                console.log(result.error)
                throw new Error(result.error)
            }

            setIsOpen(false)
            form.reset()
            setStep(0)
            toast({
                title: "Filament erstellt",
                description: `Du hast ${values.name} erstellt`,
            })
            onUpdate?.()
        } catch (error) {
            toast({
                title: "Filament konnte nicht erstellt werden",
                description: "Es ist ein Fehler aufgetreten",
                variant: "destructive"
            })
            console.log(error)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Neues Filament eintragen</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Das Filament ist noch nicht in der Datenbank? Dann trage es hier ein.</p>
                <h4 className="text-xl font-bold mt-4">Dazu benötigst du:</h4>
                <ul className="list-disc list-inside mt-2">
                    <li>Name</li>
                    <li>Hersteller</li>
                    <li>Gewicht</li>
                    <li>Farbe</li>
                    <li>Typ</li>
                </ul>
            </CardContent>
            <CardFooter>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger>
                        <Button variant="outline">Neues Filament</Button>
                    </DialogTrigger>
                    <DialogContent className={cn("max-w-4xl max-h-screen overflow-scroll", step === 1 && "max-w-md")}>
                        <DialogHeader>
                            <DialogTitle>Neues Filament</DialogTitle>
                            <DialogDescription>Trage ein neues Filament ein</DialogDescription>
                        </DialogHeader>
                        {error && (
                            <div className="text-red-500 mb-4">{error}</div>
                        )}
                        {step == 0 && (
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
                                                                <SelectItem key={type}
                                                                            value={type}>{type}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription/>
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
                                                                <SelectItem key={manufacturer}
                                                                            value={manufacturer}>{manufacturer}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription/>
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
                                                    <Input
                                                        {...field}
                                                        placeholder="PLA Rot Cool"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
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
                                                    <Input
                                                        {...field}
                                                        placeholder="Rot"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
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
                                                    <Input
                                                        {...field}
                                                        placeholder="#ffffff"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
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
                                                    <Input
                                                        {...field}
                                                        placeholder="Mocha Mousse"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
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
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="175"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
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
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="1000"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
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
                                                    <Input
                                                        {...field}
                                                        placeholder="400"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
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
                                                                <SelectItem key={status}
                                                                            value={status}>{status}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription/>
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
                                                <FormDescription/>
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
                                                <FormDescription/>
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
                                                <FormDescription/>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="link"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Link zum Produkt</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="https://example.com"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        )}
                        {hasPermission && step == 1 && (
                            <Scanner
                                constraints={{
                                    // Start with basic constraints
                                    facingMode: "environment",
                                    // Only add deviceId if devices are available
                                    ...(devices.length > 0 && {
                                        deviceId: devices[0].deviceId
                                    })
                                }}
                                onScan={(codes) => {
                                    if (codes?.[0]?.rawValue) {
                                        handleScan(codes[0].rawValue);
                                    }
                                }}
                                onError={(err) => {
                                    console.error("Scanner error:", err);
                                    if (err === 'OverconstrainedError') {
                                        // Fall back to basic constraints
                                        setDevices([]); // This will trigger a re-render with just facingMode
                                    } else {
                                        setError("Scanner error: " + err);
                                    }
                                }}
                                styles={{
                                    container: {
                                        width: '100%',
                                        maxWidth: '500px'
                                    }
                                }}
                            />
                        )}
                        {step === 2 && (
                            <Alert>
                                <CheckCircle className="w-6 h-6 mr-2"/>
                                <AlertTitle>QR Code wurde gescannt</AlertTitle>
                                <AlertDescription>Klicke auf bestätigen um die Registrierung
                                    abzuschließen</AlertDescription>
                            </Alert>
                        )}
                        <DialogFooter className="gap-4">
                            {step == 0 && (
                                <Button onClick={() => setStep(1)}>QR Code verknüpfen</Button>
                            )}
                            {step == 1 && (
                                <Button variant="secondary" onClick={() => setStep(0)}>Zurück</Button>
                            )}
                            <Button onClick={form.handleSubmit(onSubmit)} disabled={processing}>Bestätigen</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    )
}

export const FilamentCard = ({filament, onUpdate, showButtons, size}: {
    filament: typeof filamentsTable.$inferSelect;
    onUpdate?: () => void;
    showButtons?: boolean;
    size?: "sm" | "md" | "lg";
}) => {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const {toast} = useToast();

    const form = useForm<z.infer<typeof UsageSchema>>({
        resolver: zodResolver(UsageSchema),
        defaultValues: {
            usedAt: new Date(),
        }
    })

    const onSubmit = async (values: z.infer<typeof UsageSchema>) => {
        try {
            setProcessing(true)

            console.log(values)

            const result = await updateUsedFilament(
                filament.id,
                filament.restWeight,
                values.usedWeight
            )

            if (!result.success) {
                console.log(result.error)
                throw new Error(result.error)
            }

            setOpen(false)
            form.reset()
            toast({
                title: "Filament aktualisiert",
                description: `Du hast ${values.usedWeight}g von ${filament.name} genutzt`,
            })
            onUpdate?.()
        } catch {
            toast({
                title: "Error",
                description: "Filament konnte nicht aktualisiert werden",
                variant: "destructive"
            })
        } finally {
            setProcessing(false)
        }
    }

    const deleteFilamentLogic = async () => {
        deleteFilament(filament.id)
            .then(() => {
                toast({
                    title: "Filament gelöscht",
                    description: `Du hast ${filament.name} gelöscht`,
                })
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
        <Card className={cn("relative overflow-hidden", size === "lg" && "min-w-96")}>
            <CircleDot size={size === "lg" ? 128 : 100} color={filament.colorHex ? filament.colorHex : "#ffffff"}
                       className={cn("absolute top-14 -right-10", filament.colorHex === "#ffffff" && "bg-black/60 dark:bg-none rounded-full", filament.colorHex === "#000000" && "dark:bg-white/60 bg-none rounded-full")}/>
            <CardHeader>
                <CardTitle>{filament.name}{size === "lg" && <span> - #{filament.id}</span>}</CardTitle>
                <CardDescription>{filament.type} - {filament.manufacturer}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <p>Farbe: <Badge>{filament.color}</Badge></p>
                {size === "lg" && <p>Gewicht (volle Spule): <Badge>{filament.weight}g</Badge></p>}
                <p>Restgewicht: <Badge>{filament.restWeight}g</Badge></p>
                {size === "lg" && <p>Status: <Badge>{filament.status}</Badge></p>}
                <p>Nutzung: <Progress value={filament.restWeight / (filament.weight ?? 100) * 100}/></p>
            </CardContent>
            {showButtons && (
                <CardFooter className="gap-4">
                    <Button variant="destructive" size="icon" onClick={deleteFilamentLogic}
                            disabled={processing}><Trash/></Button>
                    <FilamentDetailsDialog filament={filament}
                                           onUpdate={() => onUpdate?.()}/>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger>
                            <Button>Nutzung angeben</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Gib genutztes Filament an</DialogTitle>
                                <DialogDescription>{filament.name}</DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="usedWeight"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Genutztes Gewicht</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="42"
                                                        disabled={processing}
                                                    />
                                                </FormControl>
                                                <FormDescription/>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                            <DialogFooter>
                                <Button onClick={form.handleSubmit(onSubmit)}
                                        disabled={processing}>Bestätigen</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            )}
        </Card>
    )
}