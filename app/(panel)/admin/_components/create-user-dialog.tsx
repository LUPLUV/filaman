"use client"

import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormItem, FormMessage } from "@/components/ui/form"
import { createUser } from "@/actions/users"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

export function CreateUserDialog() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
            role: "user",
        },
        onSubmit: async ({ value }) => {
            try {
                await createUser(value)
                setOpen(false)
                toast({
                    title: "Success",
                    description: "User created successfully",
                })
                form.reset()
            } catch (e: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: e.message || "Failed to create user",
                })
            }
        },
        // @ts-ignore
        validatorAdapter: zodValidator(),
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        Create a new user account and set their permissions.
                    </DialogDescription>
                </DialogHeader>
                
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="grid gap-4 py-4"
                >
                    <form.Field
                        name="username"
                        validators={{
                            onChange: z.string().min(3, "Username must be at least 3 characters").max(255)
                        }}
                        children={(field) => (
                            <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                <Label htmlFor={field.name}>Username</Label>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Enter username"
                                    autoComplete="off"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <form.Field
                        name="password"
                        validators={{
                            onChange: z.string().min(4, "Password must be at least 4 characters").max(255)
                        }}
                        children={(field) => (
                            <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                <Label htmlFor={field.name}>Password</Label>
                                <Input
                                    id={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Enter password"
                                    autoComplete="off"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <form.Field
                        name="role"
                        validators={{
                            onChange: z.enum(["admin", "user"])
                        }}
                        children={(field) => (
                            <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                                <Label htmlFor={field.name}>Role</Label>
                                <Select
                                    value={field.state.value}
                                    onValueChange={(val) => field.handleChange(val as "admin" | "user")}
                                >
                                    <SelectTrigger id={field.name}>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex justify-end pt-4">
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create User"}
                                </Button>
                            )}
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
