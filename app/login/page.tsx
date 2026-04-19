"use client";

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useState } from 'react';

const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export default function LoginPage() {
  const [serverError, setServerError] = useState("");

  const form = useForm({
    validators: {
      onSubmit: LoginSchema,
    },
    defaultValues: {
      username: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      setServerError("");
      const formData = new FormData();
      formData.append("username", value.username);
      formData.append("password", value.password);

      const result = await login(null, formData);
      if (result?.error) {
        setServerError(result.error);
      }
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-xs">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-brand">FilaMan</h1>
          <p className="text-muted-foreground">Log in to your account</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <form.Field
              name="username"
              validators={{
                onChange: LoginSchema.shape.username
              }}
              children={(field) => (
                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="admin"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <form.Field
              name="password"
              validators={{
                onChange: LoginSchema.shape.password
              }}
              children={(field) => (
                <FormItem error={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : undefined}>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {serverError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
