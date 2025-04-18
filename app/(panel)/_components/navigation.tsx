import {ThemeToggle} from "@/components/theme-toggle";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {SignedIn, UserButton} from "@clerk/nextjs";

export const Navigation = () => {
    return (
        <nav className="flex justify-between items-center p-4 mt-4 rounded-xl border bg-muted/20">
            <Link href="/">
                <h2 className="text-4xl font-bold text-brand">
                    FilaMan
                </h2>
            </Link>
            <ul className="hidden sm:flex gap-8">
                <NavigationItem href="/">Filamente</NavigationItem>
            </ul>
            <div className="hidden sm:flex gap-4 items-center">
                <ThemeToggle/>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
            <div className="block sm:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-4">
                        <DropdownMenuItem>
                            <NavigationItem href="/">Filamente</NavigationItem>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <NavigationItem href="/scan">Scannen</NavigationItem>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}

const NavigationItem = ({children, href}: { children: React.ReactNode, href: string }) => {
    return (
        <li className="list-none">
            <Link href={href} className="font-bold">
                {children}
            </Link>
        </li>
    );
}