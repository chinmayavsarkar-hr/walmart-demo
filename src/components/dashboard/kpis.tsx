import { cn } from "@/lib/utils";
import { kpis } from "@/lib/data";

export function Kpis() {
  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="relative overflow-hidden rounded-card border border-line bg-surface px-[18px] py-[15px] shadow-card"
        >
          <span
            className={cn(
              "absolute inset-y-0 left-0 w-1",
              "accent" in kpi && kpi.accent ? "bg-spark" : "bg-wm-blue",
            )}
          />
          <div className="text-[11px] font-semibold uppercase tracking-[0.4px] text-muted">
            {kpi.label}
          </div>
          <div className="mt-2 text-[29px] font-extrabold leading-none tracking-[-1px] text-wm-ink">
            {kpi.value}
            {"unit" in kpi && kpi.unit ? (
              <span className="ml-1 text-sm font-semibold text-faint">
                {kpi.unit}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-[11.5px] font-semibold text-green">
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
