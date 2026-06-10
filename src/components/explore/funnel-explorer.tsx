"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, TriangleAlert } from "lucide-react";
import { Pipeline } from "@/components/dashboard/pipeline";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { funnel, funnelInsights, type Seller } from "@/lib/data";
import { StageOverview } from "./stage-overview";

export function FunnelExplorer({ sellers }: { sellers: Seller[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedStage = funnel.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[340px_1fr]">
      {/* Interactive funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Acquisition funnel</CardTitle>
          {selectedId ? (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-muted transition hover:bg-surface-2 hover:text-wm-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wm-blue"
            >
              <ArrowLeft className="size-3" />
              Back to sellers
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-faint">
              click a stage
            </span>
          )}
        </CardHeader>
        <div className="px-4 py-[18px]">
          {funnel.map((stage) => {
            const active = stage.id === selectedId;
            return (
              <button
                key={stage.id}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setSelectedId((cur) => (cur === stage.id ? null : stage.id))
                }
                className={cn(
                  "group mx-auto mb-2 flex items-center rounded-[9px] px-3.5 py-[11px] text-left text-white transition-all last:mb-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wm-ink",
                  active
                    ? "shadow-md ring-2 ring-wm-ink ring-offset-1"
                    : "hover:brightness-105 hover:saturate-150",
                )}
                style={{ width: stage.width, background: stage.grad }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] font-semibold opacity-95">
                    {stage.name}
                  </span>
                  <span className="mt-px flex items-baseline gap-1.5 text-[19px] font-extrabold leading-none tracking-[-0.5px]">
                    {stage.count.toLocaleString()}
                    {stage.pct != null ? (
                      <em className="text-[11px] font-semibold not-italic opacity-80">
                        {stage.pct}%
                      </em>
                    ) : null}
                  </span>
                </span>
                <ChevronRight
                  className={cn(
                    "size-4 flex-none transition-transform",
                    active
                      ? "translate-x-0.5 opacity-100"
                      : "opacity-0 group-hover:opacity-90",
                  )}
                />
              </button>
            );
          })}

          <div className="mt-3.5 flex items-start gap-2 rounded-[9px] border border-[#f2d9a6] bg-amber-bg px-3 py-2.5 text-[11.5px] text-[#8a5a00]">
            <TriangleAlert className="mt-px size-3.5 flex-none" />
            <div>
              <b className="text-[#6b4500]">23 stalled</b> at verification —
              click that stage for the AI breakdown.
            </div>
          </div>
        </div>
      </Card>

      {/* Right panel — seller list, replaced by the AI overview on selection */}
      {selectedStage ? (
        <StageOverview
          key={selectedStage.id}
          stage={selectedStage}
          insight={funnelInsights[selectedStage.id]}
        />
      ) : (
        <Pipeline sellers={sellers} defaultOpenId={null} />
      )}
    </div>
  );
}
