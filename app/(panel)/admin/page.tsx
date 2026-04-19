import { getUsers } from "@/actions/users"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CreateUserDialog } from "./_components/create-user-dialog"
import { UserActionDropdown } from "./_components/user-action-dropdown"
import { Badge } from "@/components/ui/badge"

export default async function AdminPage() {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== "admin") {
        redirect("/");
    }

    const users = await getUsers();

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center bg-card border rounded-xl p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Administration</h1>
                    <p className="text-muted-foreground mt-2">Manage panel access and roles.</p>
                </div>
                <CreateUserDialog />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="pl-6">Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="pl-6 font-medium">{user.username}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <UserActionDropdown user={user} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
