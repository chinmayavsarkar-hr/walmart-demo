"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Lightbulb, Sparkles, TrendingDown } from "lucide-react";
import {
  channelColor,
  channelIcon,
  channelName,
} from "@/components/dashboard/icons";
import type { Stage, StageInsight } from "@/lib/data";

/** Reveals `text` character-by-character from mount. */
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

/**
 * Remount this with a `key={stage.id}` so each stage selection replays the
 * "generation" sequence (skeleton → streamed content).
 */
export function StageOverview({
  stage,
  insight,
}: {
  stage: Stage;
  insight: StageInsight;
}) {
  const [generating, setGenerating] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setGenerating(false), 700);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-gradient-to-r from-[#e9f0fb] to-surface px-[18px] py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 flex-none items-center justify-center rounded-[9px] bg-gradient-to-br from-wm-ink to-wm-blue text-white">
            <Sparkles className="size-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-extrabold text-wm-ink">
                {stage.name}
              </h2>
              <span className="rounded-full bg-[#e7f0fb] px-2 py-px text-[10px] font-bold text-wm-ink">
                AI overview
              </span>
            </div>
            <div className="text-[11px] text-muted">
              {stage.count.toLocaleString()} sellers analyzed
              {stage.pct != null ? ` · ${stage.pct}% of cohort` : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[640px] overflow-auto p-[18px]">
        {generating ? (
          <GeneratingSkeleton stage={stage.name} />
        ) : (
          <StageContent stage={stage} insight={insight} />
        )}
      </div>
    </div>
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
    <div className="space-y-5">
      {/* Narrative */}
      <section className="animate-detail-in">
        <p className="text-[15px] font-bold leading-snug text-wm-ink">
          {headline}
          {typing ? (
            <span className="ml-0.5 inline-block animate-pulse text-wm-blue">
              ▍
            </span>
          ) : null}
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
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
            className="rounded-[10px] border border-line bg-surface-2 px-3 py-2.5"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.3px] text-muted">
              {m.label}
            </div>
            <div className="mt-1 text-[19px] font-extrabold leading-none tracking-[-0.5px] text-wm-ink">
              {m.value}
            </div>
            {m.sub ? (
              <div className="mt-1 text-[10.5px] font-medium text-faint">
                {m.sub}
              </div>
            ) : null}
          </div>
        ))}
      </section>

      <section
        className="animate-detail-in grid grid-cols-1 gap-5 lg:grid-cols-2"
        style={{ animationDelay: "120ms" }}
      >
        {/* Drop-off / success */}
        <div>
          <h3 className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.3px] text-wm-ink">
            {terminal ? (
              <CheckCircle2 className="size-3.5 text-green" />
            ) : (
              <TrendingDown className="size-3.5 text-amber" />
            )}
            {terminal ? "Outcome" : "Why sellers drop off here"}
          </h3>

          {terminal ? (
            <div className="rounded-[10px] border border-[#b6e3c6] bg-green-bg px-3.5 py-3 text-[12px] font-semibold text-[#0e6b30]">
              No further drop-off — this is the goal state. Sellers who reach it
              are live and verified.
            </div>
          ) : (
            <div className="space-y-2.5">
              {insight.dropoff.map((d) => (
                <div key={d.reason}>
                  <div className="flex items-baseline justify-between gap-2 text-[11.5px]">
                    <span className="text-ink">{d.reason}</span>
                    <span className="font-mono font-bold text-amber">
                      {d.pct}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-[#e3eaf3]">
                    <div
                      className="h-full rounded bg-amber"
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
          <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.3px] text-wm-ink">
            Most effective outreach here
          </h3>
          <div className="space-y-3">
            {insight.channels.map((c) => {
              const Icon = channelIcon[c.channel];
              const color = channelColor[c.channel];
              return (
                <div key={c.channel}>
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-3.5" style={{ color }} />
                    <span className="text-[12px] font-bold text-wm-ink">
                      {channelName[c.channel]}
                    </span>
                    <span className="ml-auto font-mono text-[11px] font-bold text-muted">
                      {c.effectiveness}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-[#e3eaf3]">
                    <div
                      className="h-full rounded"
                      style={{ width: `${c.effectiveness}%`, background: color }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-muted">{c.note}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recommendation */}
      <section
        className="animate-detail-in flex items-start gap-3 rounded-[11px] border border-[#bcd0ec] bg-[#eaf1fb] px-4 py-3.5"
        style={{ animationDelay: "180ms" }}
      >
        <span className="flex size-8 flex-none items-center justify-center rounded-[9px] bg-wm-ink text-white">
          <Lightbulb className="size-4" />
        </span>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.3px] text-wm-ink">
            The agent&apos;s play
          </div>
          <p className="mt-0.5 text-[12.5px] font-semibold leading-snug text-wm-ink">
            {insight.recommendation}
          </p>
        </div>
      </section>

      <p className="pt-1 text-center text-[10.5px] text-faint">
        Generated by HappyRobot Twin from {stage.count.toLocaleString()} seller
        records · staged demo data
      </p>
    </div>
  );
}

function GeneratingSkeleton({ stage }: { stage: string }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[12.5px] font-semibold text-wm-ink">
        <Sparkles className="size-4 animate-pulse" />
        Analyzing {stage}
        <span className="animate-pulse">…</span>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-4/5 animate-pulse rounded bg-line" />
        <div className="h-3 w-full animate-pulse rounded bg-line" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-line" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-[10px] bg-line" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="h-28 animate-pulse rounded-[10px] bg-line" />
        <div className="h-28 animate-pulse rounded-[10px] bg-line" />
      </div>
    </div>
  );
}
