import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { stallReasons, stalledTotal } from "@/lib/data";
import { channelColor, channelIcon } from "./icons";

export function StallReasons() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Why sellers stall</CardTitle>
        <span className="text-[11px] font-semibold text-faint">
          {stalledTotal} at verification
        </span>
      </CardHeader>

      <div className="divide-y divide-line">
        {stallReasons.map((r) => {
          const Icon = channelIcon[r.channel];
          const color = channelColor[r.channel];
          return (
            <div key={r.reason} className="px-[18px] py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12.5px] font-bold text-wm-ink">
                  {r.reason}
                </span>
                <span className="font-mono text-[12px] font-bold text-amber">
                  {r.count}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-[#e3eaf3]">
                <div
                  className="h-full rounded bg-amber"
                  style={{ width: `${(r.count / stalledTotal) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex items-start gap-1.5 text-[11px] text-muted">
                <Icon
                  className="mt-px size-3 flex-none"
                  style={{ color }}
                />
                <span>
                  <span className="font-semibold text-ink">Agent:</span>{" "}
                  {r.resolution}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-line bg-green-bg px-[18px] py-2.5 text-[11.5px] font-semibold text-[#0e6b30]">
        All 4 reason types auto-worked — no manual triage queue.
      </div>
    </Card>
  );
}
