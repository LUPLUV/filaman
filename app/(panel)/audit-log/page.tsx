"use client"

import {useEffect, useState} from "react";
import {auditLogTable} from "@/db/schema";
import {getAuditLogs} from "@/actions/audit-log";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, StepBack, StepForward} from "lucide-react";
import {Input} from "@/components/ui/input";
import {AuditLogEntry} from "@/app/(panel)/audit-log/_components/audit-log-entry";

export default function AuditLogPage() {
    const [auditLogs, setAuditLogs] = useState<typeof auditLogTable.$inferSelect[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)

    const resultsPerPage = 25

    const filterResults = (logs: typeof auditLogTable.$inferSelect[]) => {
        const resultsTotal = auditLogs.length
        const start = ((currentPage ?? 0)-1)*resultsPerPage
        const end = start+resultsPerPage > resultsTotal ? resultsTotal : start+resultsPerPage
        return logs.slice(start, end)
    }

    const firstPage = () => {
        setCurrentPage(1)
    }

    const lastPage = () => {
        setCurrentPage(Math.ceil(auditLogs.length/resultsPerPage))
    }

    const nextPage = () => {
        if(currentPage < Math.ceil(auditLogs.length/resultsPerPage)) {
            setCurrentPage(currentPage+1)
        }
    }

    const previousPage = () => {
        if(currentPage > 1) {
            setCurrentPage(currentPage-1)
        }
    }

    useEffect(() => {
        getAuditLogs()
            .then(logs => {
                setAuditLogs(logs);
            })
    }, [])

    return (
        <div className="w-full min-h-screen">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold">Audit Logs</h1>
                    <h3 className="text-muted-foreground text-xl">Siehe alle Aktionen an</h3>
                </div>
                <div>
                    <div className="w-full flex justify-between">
                        <span className="text-muted-foreground text-sm">Zeigt Seite {isNaN(currentPage) ? 1 : currentPage} von {Math.ceil(auditLogs.length/resultsPerPage)}</span>
                        <span className="text-muted-foreground text-sm">Insgesamt: <span className="text-blue-500 font-semibold">{auditLogs.length}</span> Einträge</span>
                    </div>
                    <Card className="p-2 w-full flex flex-row justify-between mt-1">
                        <div className="flex gap-1">
                            <Button disabled={currentPage <= 1} onClick={firstPage} size="sicon" variant="outline"><StepBack/></Button>
                            <Button disabled={currentPage <= 1} onClick={previousPage} size="sicon" variant="outline"><ChevronLeft/></Button>
                        </div>
                        <div className="flex items-center">
                            <Input className="w-16 text-center h-8" value={currentPage}
                                   disabled/>
                            <span className="text-muted-foreground ml-2">von {Math.ceil(auditLogs.length/resultsPerPage)}</span>
                        </div>
                        <div className="flex gap-1">
                            <Button disabled={currentPage >= Math.ceil(auditLogs.length/resultsPerPage)} onClick={nextPage} size="sicon" variant="outline"><ChevronRight/></Button>
                            <Button disabled={currentPage >= Math.ceil(auditLogs.length/resultsPerPage)} onClick={lastPage} size="sicon" variant="outline"><StepForward/></Button>
                        </div>
                    </Card>
                    <div className="flex flex-col gap-2 mt-4">
                        {filterResults(auditLogs).map((log) => (
                            <AuditLogEntry log={log} key={log.id}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}