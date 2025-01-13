import {Navigation} from "@/app/(panel)/_components/navigation";

export default function PanelLayout ({children}: {
    children: React.ReactNode
}) {
    return (
        <main className="mx-4 sm:mx-8 md:mx-10 min-h-screen">
            <Navigation/>
            <div className="mt-10 min-h-screen">
            {children}
            </div>
        </main>
    )
}