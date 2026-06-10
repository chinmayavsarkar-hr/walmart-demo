import { cn } from "@/lib/utils";

function Progress({
  value,
  className,
  barClassName,
  ...props
}: React.ComponentProps<"div"> & { value: number; barClassName?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 overflow-hidden rounded bg-[#e3eaf3]", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded bg-gradient-to-r from-wm-blue to-spark transition-[width] duration-500 ease-out",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
