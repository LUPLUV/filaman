import {Navigation} from "@/app/(panel)/_components/navigation";

export default function PanelLayout ({children}: {
    children: React.ReactNode
}) {
    return (
        <main className="w-full min-h-screen">
            <Navigation/>
            <div className="mx-10 mt-10">
            {children}
            </div>
        </main>
    )
}