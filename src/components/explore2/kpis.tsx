import { Card } from "@/components/sleek/ui";
import { kpis } from "@/lib/data";

export function SleekKpis() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="p-5">
          <div className="text-[12px] font-medium text-zinc-500">
            {kpi.label}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[28px] font-semibold leading-none tracking-tight text-zinc-900">
              {kpi.value}
            </span>
            {"unit" in kpi && kpi.unit ? (
              <span className="text-sm font-medium text-zinc-400">
                {kpi.unit}
              </span>
            ) : null}
          </div>
          <div className="mt-2 text-[12px] font-medium text-emerald-600">
            {kpi.delta}
          </div>
        </Card>
      ))}
    </div>
  );
}
