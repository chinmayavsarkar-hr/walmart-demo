"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="animate-overlay-in fixed inset-0 z-50 bg-wm-ink/55 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "animate-dialog-in fixed left-1/2 top-1/2 z-50 max-h-[92dvh] w-[calc(100vw-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card border border-line bg-surface shadow-card focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-3.5 top-3.5 z-10 flex size-8 items-center justify-center rounded-full text-faint transition hover:bg-surface-2 hover:text-wm-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wm-blue">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
