import {Navigation} from "@/app/(panel)/_components/navigation";
import {Footer} from "@/app/(panel)/_components/footer";

export default function PanelLayout ({children}: {
    children: React.ReactNode
}) {
    return (
        <main className="mx-4 sm:mx-8 md:mx-10 min-h-screen">
            <Navigation/>
            <div className="mt-4 min-h-screen">
            {children}
            </div>
            <Footer/>
        </main>
    )
}