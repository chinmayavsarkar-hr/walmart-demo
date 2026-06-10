import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "outline";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-wm-blue text-white hover:bg-wm-blue-dk shadow-sm disabled:opacity-60",
  ghost: "text-muted hover:bg-surface-2 hover:text-wm-ink",
  outline: "border border-line-dk text-wm-ink hover:bg-surface-2",
};

function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wm-blue disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Button };
export type { ButtonVariant };
