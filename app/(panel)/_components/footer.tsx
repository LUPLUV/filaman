import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="flex justify-between items-center p-4 my-4 rounded-xl border bg-muted/20">
            <div className="text-sm">
                &copy; {new Date().getFullYear()} Filaman
            </div>
            <div className="text-sm">
                <Link href="https://fablab-nuernberg.de" target="_blank" className="hover:underline">
                    Fab Lab Region Nürnberg e.V.
                </Link>
                <span className="mx-2">|</span>
                <Link href="https://filaman.xyz" target="_blank" className="hover:underline">
                    Filaman Spool Management Software
                </Link>
            </div>
            <Link href="https://lupluv.dev" target="_blank" className="text-sm hover:underline">
                Built by Thore
            </Link>
        </footer>
    )
}