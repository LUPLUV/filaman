import {auditLogTable} from "@/db/schema";
import {Badge} from "@/components/ui/badge";
import {Check, ChevronDown, Copy} from "lucide-react";
import {Card} from "@/components/ui/card";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

export const AuditLogEntry = ({log}: { log: typeof auditLogTable.$inferSelect }) => {
    const [open, setOpen] = useState(false)
    return (
        <Card className="w-full">
            <div className="flex flex-row justify-between p-3 cursor-pointer" onClick={() => setOpen(!open)}>
                <div className="flex gap-2 items-center">
                    {log.action?.startsWith("new") ? <Badge variant="success">NEU</Badge> : log.action?.startsWith("update") ? <Badge variant="blue">UPDATE</Badge> : log.action?.startsWith("delete") ? <Badge variant="delete">LÖSCHEN</Badge> : log.action?.startsWith("weight") ? <Badge variant="update">GEWICHT</Badge> : log.action?.startsWith("status") ? <Badge variant="update">GEWICHT</Badge> : <Badge variant="outline">UNBEKANNT</Badge>}

                    <span className="capitalize">{log.action?.replaceAll("_", " ")}</span>
                    <span className="text-muted-foreground text-xs">ID {log.rowId}</span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground text-xs">{log.createdAt.toLocaleString("DE")}</span>
                    <Badge variant="success">200</Badge>
                    <ChevronDown size="16"/>
                </div>
            </div>
            {open && (
                <div className="w-full p-3 grid grid-cols-2 border-t gap-4">
                    <div className="">
                        <Label>Alte Daten</Label>
                        <JsonDisplay json={log.oldValues ?? ""}/>
                    </div>
                    <div className="">
                        <Label>Neue Daten</Label>
                        <JsonDisplay json={log.newValues ?? ""}/>
                    </div>
                </div>
            )}
        </Card>
    )
}

export const JsonDisplay = ({json}: { json: object }) => {
    const [copied, setCopied] = useState(false)

    const copyValue = () => {
        navigator.clipboard.writeText(JSON.stringify(json, null, 2))
            .then(() => {
                setCopied(true)
                setTimeout(() => {
                    setCopied(false)
                }, 1000)
            })
    }

    return (
        <Card className="p-3 mt-1 group relative">
            <Button size="icon" variant="outline" onClick={copyValue}
                    className="group-hover:inline-flex hidden absolute top-4 right-4">{copied ? <Check/> : <Copy/>}</Button>
            <pre>
                {JSON.stringify(json, null, 2)}
            </pre>
        </Card>
    )
}