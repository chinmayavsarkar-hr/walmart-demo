"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, TriangleAlert } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
} from "@/components/sleek/ui";
import { cn } from "@/lib/utils";
import { funnel, funnelInsights, type Seller } from "@/lib/data";
import { SleekPipeline } from "./pipeline";
import { StageOverview } from "./stage-overview";

export function FunnelExplorer({ sellers }: { sellers: Seller[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedStage = funnel.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[340px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Acquisition funnel</CardTitle>
          {selectedId ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedId(null)}
            >
              <ArrowLeft className="size-3.5" />
              Back to sellers
            </Button>
          ) : (
            <span className="text-[11px] text-zinc-400">click a stage</span>
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
                  "group mx-auto mb-2 flex items-center rounded-[10px] px-3.5 py-[11px] text-left text-white transition-all last:mb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wm-ink focus-visible:ring-offset-1",
                  active
                    ? "shadow-md ring-2 ring-wm-ink ring-offset-1"
                    : "hover:brightness-105",
                )}
                style={{ width: stage.width, background: stage.grad }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] font-semibold opacity-95">
                    {stage.name}
                  </span>
                  <span className="mt-px flex items-baseline gap-1.5 text-[19px] font-bold leading-none tracking-[-0.5px]">
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

          <p className="mt-3.5 flex items-start gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-[11.5px] text-amber-800">
            <TriangleAlert className="mt-px size-3.5 flex-none text-amber-500" />
            <span>
              <b className="font-semibold">23 stalled</b> at verification — click
              that stage for the AI breakdown.
            </span>
          </p>
        </div>
      </Card>

      {selectedStage ? (
        <StageOverview
          key={selectedStage.id}
          stage={selectedStage}
          insight={funnelInsights[selectedStage.id]}
        />
      ) : (
        <SleekPipeline sellers={sellers} defaultOpenId={null} />
      )}
    </div>
  );
}
