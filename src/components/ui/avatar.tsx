import { cn } from "@/lib/utils";

function Avatar({
  initials,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { initials: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex size-8 flex-none items-center justify-center rounded-[9px] bg-gradient-to-br from-wm-blue to-wm-blue-dk text-xs font-bold text-white",
        className,
      )}
      style={style}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar };
