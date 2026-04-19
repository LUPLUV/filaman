"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Minimal context to tie FormItem, FormLabel, FormControl, and FormMessage together for accessibility
type FormItemContextValue = {
  id: string
  error?: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => {
    const id = React.useId()
    return (
      <FormItemContext.Provider value={{ id, error }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
  ({ className, ...props }, ref) => {
    const { id, error } = React.useContext(FormItemContext)
    return (
      <Label
        ref={ref}
        className={cn(error && "text-destructive", className)}
        htmlFor={`${id}-form-item`}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { id, error } = React.useContext(FormItemContext)
    return (
      <Slot
        ref={ref}
        id={`${id}-form-item`}
        aria-describedby={!error ? `${id}-form-item-description` : `${id}-form-item-description ${id}-form-item-message`}
        aria-invalid={!!error}
        {...props}
      />
    )
  }
)
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { id } = React.useContext(FormItemContext)
    return (
      <p
        ref={ref}
        id={`${id}-form-item-description`}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    )
  }
)
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { id, error } = React.useContext(FormItemContext)
    const body = error || children
    if (!body) return null

    return (
      <p
        ref={ref}
        id={`${id}-form-item-message`}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
