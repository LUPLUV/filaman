export const Navigation = () => {
    return (
        <nav className="bg-muted h-20 w-full flex justify-between items-center px-20">
            <h2 className="text-4xl font-bold text-brand">
                FilaMan
            </h2>
            <ul className="flex gap-8">
                <li>Filaments</li>
                <li>Order</li>
                <li>Settings</li>
            </ul>
        </nav>
    );
}