import { cn } from "@/lib/utils";

/*
 * shadcn-style primitives on a neutral zinc palette — the sleek design system
 * for /explore2. Kept separate from the Walmart-themed `components/ui` so the
 * rest of the app is untouched. A single accent (wm-blue) is used sparingly.
 */

/* ----------------------------- Card ----------------------------- */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-[52px] items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-[13px] font-semibold tracking-tight text-zinc-900",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}

/* ----------------------------- Badge ---------------------------- */
type BadgeVariant = "default" | "secondary" | "outline";
const badgeVariants: Record<BadgeVariant, string> = {
  default: "border-transparent bg-zinc-900 text-white",
  secondary: "border-transparent bg-zinc-100 text-zinc-700",
  outline: "border-zinc-200 text-zinc-600",
};

export function Badge({
  variant = "secondary",
  className,
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

/* ----------------------------- Button --------------------------- */
type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "brand";
type ButtonSize = "default" | "sm" | "icon";

const buttonVariants: Record<ButtonVariant, string> = {
  default: "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  outline: "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
  brand: "bg-wm-blue text-white hover:bg-wm-blue-dk",
};
const buttonSizes: Record<ButtonSize, string> = {
  default: "h-9 px-4 text-[13px]",
  sm: "h-8 px-3 text-xs",
  icon: "size-9",
};

export function Button({
  variant = "default",
  size = "default",
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  );
}

/* ---------------------------- Progress -------------------------- */
export function Progress({
  value,
  className,
  indicatorClassName,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-zinc-100",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full bg-zinc-900 transition-all", indicatorClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* --------------------------- Skeleton --------------------------- */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-100", className)}
      {...props}
    />
  );
}

/* -------------------------- Separator --------------------------- */
export function Separator({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div
      role="separator"
      className={cn(
        "bg-zinc-200",
        orientation === "vertical" ? "w-px self-stretch" : "h-px w-full",
        className,
      )}
    />
  );
}

/* ---------------------------- Avatar ---------------------------- */
export function Avatar({
  initials,
  className,
  style,
}: {
  initials: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "flex size-9 flex-none items-center justify-center rounded-full bg-zinc-100 text-[12px] font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-200",
        className,
      )}
    >
      {initials}
    </div>
  );
}
