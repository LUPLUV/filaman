import {ThemeToggle} from "@/components/theme-toggle";
import Link from "next/link";

export const Navigation = () => {
    return (
        <nav className="flex justify-between items-center p-4 mt-4 mx-10 rounded-xl border bg-muted/20">
            <h2 className="text-4xl font-bold text-brand">
                FilaMan
            </h2>
            <ul className="flex gap-8">
                <NavigationItem href="/">Filaments</NavigationItem>
                <NavigationItem href="/scan">Scan</NavigationItem>
            </ul>
            <ThemeToggle/>
        </nav>
    );
}

const NavigationItem = ({children, href}: {children: React.ReactNode, href: string}) => {
    return (
        <li>
            <Link href={href} className="font-bold">
                {children}
            </Link>
        </li>
    );
}