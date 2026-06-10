"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Lightbulb, Sparkles, TrendingDown } from "lucide-react";
import {
  channelColor,
  channelIcon,
  channelName,
} from "@/components/dashboard/icons";
import { Badge, Card, Separator, Skeleton } from "@/components/sleek/ui";
import type { Stage, StageInsight } from "@/lib/data";

function useTypewriter(text: string, speed = 14) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

/** Remount with key={stage.id} to replay the generation sequence. */
export function StageOverview({
  stage,
  insight,
}: {
  stage: Stage;
  insight: StageInsight;
}) {
  const [generating, setGenerating] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setGenerating(false), 650);
    return () => clearTimeout(id);
  }, []);

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-100 px-5 py-4">
        <span className="flex size-8 flex-none items-center justify-center rounded-md bg-gradient-to-br from-wm-blue to-wm-ink text-white">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold tracking-tight text-zinc-900">
              {stage.name}
            </h3>
            <Badge
              variant="outline"
              className="gap-1 border-wm-blue/30 bg-[#eaf3fb] text-wm-blue"
            >
              <Sparkles className="size-2.5" />
              AI overview
            </Badge>
          </div>
          <p className="text-[12px] text-zinc-500">
            {stage.count.toLocaleString()} sellers analyzed
            {stage.pct != null ? ` · ${stage.pct}% of cohort` : ""}
          </p>
        </div>
      </div>

      <div className="max-h-[640px] overflow-auto p-5">
        {generating ? (
          <GeneratingSkeleton stage={stage.name} />
        ) : (
          <StageContent stage={stage} insight={insight} />
        )}
      </div>
    </Card>
  );
}

function StageContent({
  stage,
  insight,
}: {
  stage: Stage;
  insight: StageInsight;
}) {
  const headline = useTypewriter(insight.headline);
  const typing = headline.length < insight.headline.length;
  const terminal = insight.dropoff.length === 0;

  return (
    <div className="space-y-6">
      {/* Narrative */}
      <section className="animate-detail-in">
        <p className="text-[16px] font-semibold leading-snug tracking-tight text-zinc-900">
          {headline}
          {typing ? (
            <span className="ml-0.5 inline-block animate-pulse text-wm-blue">
              ▍
            </span>
          ) : null}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
          {insight.narrative}
        </p>
      </section>

      {/* Metrics */}
      <section
        className="animate-detail-in grid grid-cols-3 gap-3"
        style={{ animationDelay: "60ms" }}
      >
        {insight.metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-zinc-200 bg-zinc-50/60 px-3.5 py-3"
          >
            <div className="text-[11px] font-medium text-zinc-500">
              {m.label}
            </div>
            <div className="mt-1 text-[20px] font-semibold leading-none tracking-tight text-zinc-900">
              {m.value}
            </div>
            {m.sub ? (
              <div className="mt-1 text-[11px] text-zinc-400">{m.sub}</div>
            ) : null}
          </div>
        ))}
      </section>

      <Separator />

      <section
        className="animate-detail-in grid grid-cols-1 gap-7 lg:grid-cols-2"
        style={{ animationDelay: "120ms" }}
      >
        {/* Drop-off / outcome */}
        <div>
          <h4 className="mb-3 flex items-center gap-1.5 text-[12px] font-semibold text-zinc-900">
            {terminal ? (
              <CheckCircle2 className="size-3.5 text-zinc-400" />
            ) : (
              <TrendingDown className="size-3.5 text-zinc-400" />
            )}
            {terminal ? "Outcome" : "Why sellers drop off here"}
          </h4>

          {terminal ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-[12.5px] text-zinc-600">
              No further drop-off — this is the goal state. Sellers who reach it
              are live and verified.
            </div>
          ) : (
            <div className="space-y-3">
              {insight.dropoff.map((d) => (
                <div key={d.reason}>
                  <div className="flex items-baseline justify-between gap-2 text-[12px]">
                    <span className="text-zinc-700">{d.reason}</span>
                    <span className="font-medium tabular-nums text-zinc-500">
                      {d.pct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Channel effectiveness */}
        <div>
          <h4 className="mb-3 text-[12px] font-semibold text-zinc-900">
            Most effective outreach here
          </h4>
          <div className="space-y-3.5">
            {insight.channels.map((c) => {
              const Icon = channelIcon[c.channel];
              return (
                <div key={c.channel}>
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className="size-3.5"
                      style={{ color: channelColor[c.channel] }}
                    />
                    <span className="text-[12.5px] font-medium text-zinc-800">
                      {channelName[c.channel]}
                    </span>
                    <span className="ml-auto text-[11px] font-medium tabular-nums text-zinc-500">
                      {c.effectiveness}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.effectiveness}%`,
                        background: channelColor[c.channel],
                      }}
                    />
                  </div>
                  <div className="mt-1 text-[11.5px] text-zinc-400">{c.note}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recommendation */}
      <section
        className="animate-detail-in flex items-start gap-3 rounded-lg border border-wm-blue/15 bg-[#eaf3fb] px-4 py-3.5"
        style={{ animationDelay: "180ms" }}
      >
        <span className="flex size-7 flex-none items-center justify-center rounded-md bg-wm-blue text-white">
          <Lightbulb className="size-3.5" />
        </span>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-wm-blue">
            The agent&apos;s play
          </div>
          <p className="mt-0.5 text-[12.5px] leading-snug text-zinc-700">
            {insight.recommendation}
          </p>
        </div>
      </section>

      <p className="text-center text-[10.5px] text-zinc-400">
        Generated by HappyRobot Twin from {stage.count.toLocaleString()} seller
        records · staged demo data
      </p>
    </div>
  );
}

function GeneratingSkeleton({ stage }: { stage: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[12.5px] font-medium text-wm-blue">
        <Sparkles className="size-4 animate-pulse" />
        Analyzing {stage}
        <span className="animate-pulse">…</span>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <div className="grid grid-cols-2 gap-7">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  );
}
