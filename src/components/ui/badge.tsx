import { cn } from "@/lib/utils";

type BadgeVariant = "active" | "progress" | "stalled" | "new";

const variants: Record<BadgeVariant, string> = {
  active: "bg-green-bg text-green",
  progress: "bg-[#e7f0fb] text-wm-blue",
  stalled: "bg-amber-bg text-amber",
  new: "bg-[#eef1f6] text-muted",
};

function Badge({
  variant = "new",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] whitespace-nowrap rounded-full px-[9px] py-1 text-[10.5px] font-bold",
        variants[variant],
        className,
      )}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeVariant };
