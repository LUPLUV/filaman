import {ThemeToggle} from "@/components/theme-toggle";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { getSession } from "@/lib/session";

export const Navigation = async () => {
    const session = await getSession();
    const isAdmin = session.role === "admin";

    return (
        <nav className="flex justify-between items-center p-4 mt-4 rounded-xl border bg-muted/20">
            <Link href="/">
                <h2 className="text-4xl font-bold text-brand">
                    FilaMan
                </h2>
            </Link>
            <ul className="hidden sm:flex gap-8">
                <NavigationItem href="/">Filamente</NavigationItem>
                <NavigationItem href="/audit-log">Audit Log</NavigationItem>
                {isAdmin && <NavigationItem href="/admin">User Admin</NavigationItem>}
            </ul>
            <div className="hidden sm:flex gap-4 items-center">
                <ThemeToggle/>
                <form action={logout}>
                    <Button variant="ghost" size="icon" type="submit" title="Logout">
                        <LogOut className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </form>
            </div>
            <div className="block sm:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                        <Menu/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-4">
                        <DropdownMenuItem asChild>
                            <Link href="/" className="font-bold cursor-pointer w-full">Filamente</Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                            <DropdownMenuItem asChild>
                                <Link href="/admin" className="font-bold cursor-pointer w-full">User Admin</Link>
                            </DropdownMenuItem>
                        )}
                        <div className="m-4 flex justify-between">
                            <ThemeToggle/>
                            <form action={logout}>
                                <Button variant="ghost" size="icon" type="submit" title="Logout">
                                    <LogOut className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </form>
                        </div>
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