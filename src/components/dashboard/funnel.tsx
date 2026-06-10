import { TriangleAlert } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { funnel } from "@/lib/data";

export function Funnel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acquisition funnel</CardTitle>
        <span className="text-[11px] font-semibold text-faint">cohort</span>
      </CardHeader>
      <div className="px-4 py-[18px]">
        {funnel.map((stage) => (
          <div
            key={stage.name}
            className="mx-auto mb-2 rounded-[9px] px-3.5 py-[11px] text-white last:mb-0"
            style={{ width: stage.width, background: stage.grad }}
          >
            <div className="text-[11.5px] font-semibold opacity-95">
              {stage.name}
            </div>
            <div className="mt-px flex items-baseline gap-1.5 text-[19px] font-extrabold leading-none tracking-[-0.5px]">
              {stage.count.toLocaleString()}
              {stage.pct != null ? (
                <em className="text-[11px] font-semibold not-italic opacity-80">
                  {stage.pct}%
                </em>
              ) : null}
            </div>
          </div>
        ))}

        <div className="mt-3.5 flex items-start gap-2 rounded-[9px] border border-[#f2d9a6] bg-amber-bg px-3 py-2.5 text-[11.5px] text-[#8a5a00]">
          <TriangleAlert className="mt-px size-3.5 flex-none" />
          <div>
            <b className="text-[#6b4500]">23 stalled</b> at verification — mostly
            tax/EIN &amp; name mismatches. Agent working them now.
          </div>
        </div>
      </div>
    </Card>
  );
}
