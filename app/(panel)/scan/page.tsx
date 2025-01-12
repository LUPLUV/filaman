"use client";

import {useEffect, useState} from "react";
import {z} from "zod";
import {UsageSchema} from "@/lib/formSchema";
import {getFilamentByCode, updateUsedFilament} from "@/actions/filaments";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Filament} from "@/db/schema";
import {useToast} from "@/hooks/use-toast";
import {Scanner} from "@yudiel/react-qr-scanner";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FilamentCard} from "@/app/(panel)/_components/filament-overview";
import {cn} from "@/lib/utils";

export default function ScanPage() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState<string>();
    const [step, setStep] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [filament, setFilament] = useState<Filament>();

    const {toast} = useToast();

    const form = useForm<z.infer<typeof UsageSchema>>({
        resolver: zodResolver(UsageSchema),
        defaultValues: {
            usedAt: new Date(),
        }
    })

    useEffect(() => {
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
    }, []);

    const handleScan = async (data: string) => {
        try {
            const filaments: Filament[] = await getFilamentByCode(data);
            console.log(filaments);
            if (!filaments) {
                throw new Error("Filament not found");
            }
            setFilament(filaments[0]);
            setStep(1);
        } catch (error) {
            console.error("Scan error:", error);
            console.error(data)
            setError("Failed to process QR code");
        }
    };

    const onSubmit = async (values: z.infer<typeof UsageSchema>) => {
        try {
            setProcessing(true)

            if (!filament) {
                throw new Error("Filament not found")
            }

            console.log(values)

            const result = await updateUsedFilament(
                filament.id,
                values.usedWeight,
                filament.restWeight
            )

            if (!result.success) {
                console.log(result.error)
                throw new Error(result.error)
            }

            form.reset()
            setStep(0)
            setError(undefined)
            toast({
                title: "Filament aktualisiert",
                description: `Du hast ${values.usedWeight}g von ${filament.name} genutzt`,
            })
        } catch {
            toast({
                title: "Error",
                description: "Failed to update filament usage",
                variant: "destructive"
            })
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className={cn("grid gap-4", step == 1 && "grid-cols-2")}>
                <Card>
                    <CardHeader>
                        {step == 0 ? (
                            <>
                                <CardTitle>Scanne den QR-Code auf dem Filament</CardTitle>
                                <CardDescription>Halte das QR-Code ca. 10cm vor die Kamera</CardDescription>
                            </>
                        ) : (
                            <>
                                <CardTitle>Genutztes Filament</CardTitle>
                                <CardDescription>Gib ein wie viel du verbraucht hast</CardDescription>
                            </>
                        )}
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="text-red-500 mb-4">{error}</div>
                        )}
                        {hasPermission && step == 0 && (
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
                        {step == 1 && (
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
                                                        autoFocus
                                                        type="number"
                                                        placeholder="26"
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
                    </CardContent>
                    <CardFooter className="gap-4">
                        {step == 1 && (
                            <>
                                <Button value="secondary" onClick={() => setStep(0)}>Zurück</Button>
                                <Button onClick={form.handleSubmit(onSubmit)} disabled={processing}>Bestätigen</Button>
                            </>
                        )}
                    </CardFooter>
                </Card>
                {filament && step == 1 && <FilamentCard filament={filament}/>}
            </div>
        </div>
    )
}