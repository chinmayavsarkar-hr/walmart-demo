import { cn } from "@/lib/utils";

/** Walmart spark mark. */
export function Spark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-[26px] flex-none", className)}
      aria-hidden
    >
      <g fill="#FFC220">
        <path d="M16 2l1.7 6.4 5.1-4.2-2.5 6.1 6.4-1.2-5.3 3.8 5.3 3.8-6.4-1.2 2.5 6.1-5.1-4.2L16 30l-1.7-6.4-5.1 4.2 2.5-6.1L5.3 22.7l5.3-3.8-5.3-3.8 6.4 1.2-2.5-6.1 5.1 4.2z" />
      </g>
    </svg>
  );
}
