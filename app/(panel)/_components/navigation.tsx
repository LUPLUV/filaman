import {ThemeToggle} from "@/components/theme-toggle";

export const Navigation = () => {
    return (
        <nav className="flex justify-between items-center p-4 mt-4 mx-10 rounded-xl border bg-muted/20">
            <h2 className="text-4xl font-bold text-brand">
                FilaMan
            </h2>
            <ul className="flex gap-8">
                <li>Filaments</li>
                <li>Order</li>
                <li>Settings</li>
            </ul>
            <ThemeToggle/>
        </nav>
    );
}