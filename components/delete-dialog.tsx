import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {AlertTriangle, Trash2, X} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

export const DeleteDialog = ({title = "Objekt löschen?", description = "Bist du dir sicher dass du dieses Objekt löschen möchtest?", onDelete, children}: {
    title: string
    description: string
    onDelete: () => void
    children: React.ReactNode
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>
                            Warnung
                        </AlertTitle>
                        <AlertDescription>
                            Diese Aktion kann nicht rückgängig gemacht werden. Bist du sicher, dass du fortfahren
                            möchtest?
                        </AlertDescription>
                    </Alert>
                    <div className="flex items-center gap-8">
                        <DialogClose asChild>
                            <Button variant="secondary">
                                Abbrechen
                                <X/>
                            </Button>
                        </DialogClose>
                        <Button
                            variant={"destructive"}
                            onClick={() => {
                                onDelete()
                            }}
                        >
                            Löschen
                            <Trash2/>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}