"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, ShieldOff, Trash2 } from "lucide-react"
import { updateUserRole, deleteUser } from "@/actions/users"
import { useToast } from "@/hooks/use-toast"
import { buttonVariants } from "@/components/ui/button"

export function UserActionDropdown({ user }: { user: any }) {
    const { toast } = useToast()

    const handleRoleChange = async (newRole: "admin" | "user") => {
        try {
            await updateUserRole(user.id, newRole)
            toast({ title: "Role updated" })
        } catch (e: any) {
            toast({ variant: "destructive", title: "Error", description: e.message })
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(user.id)
            toast({ title: "User deleted" })
        } catch (e: any) {
            toast({ variant: "destructive", title: "Error", description: e.message })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'admin' ? (
                    <DropdownMenuItem onClick={() => handleRoleChange('user')}>
                        <ShieldOff className="mr-2 h-4 w-4" /> Make User
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                        <Shield className="mr-2 h-4 w-4" /> Make Admin
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
