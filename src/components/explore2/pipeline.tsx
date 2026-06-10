"use client";

import { useState } from "react";
import { Check, ChevronDown, ShieldCheck, TriangleAlert } from "lucide-react";
import { channelIcon, sourcePill, timelineStyle } from "@/components/dashboard/icons";
import { DocumentViewer } from "@/components/dashboard/document-viewer";
import type { BadgeVariant } from "@/components/ui/badge";
import {
  Avatar,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  Progress,
} from "@/components/sleek/ui";
import { cn } from "@/lib/utils";
import { stageMeta, type Seller, type TimelineEvent } from "@/lib/data";

const statusTint: Record<BadgeVariant, string> = {
  active: "border-emerald-100 bg-emerald-50 text-emerald-700",
  progress: "border-blue-100 bg-blue-50 text-blue-700",
  stalled: "border-amber-100 bg-amber-50 text-amber-700",
  new: "border-zinc-200 bg-zinc-100 text-zinc-600",
};

const timelineTint: Record<TimelineEvent["kind"], string> = {
  portal: "bg-zinc-100 text-zinc-500",
  agent: "bg-wm-ink text-white",
  call: "bg-[#e7f0fb] text-wm-blue",
  sms: "bg-violet-bg text-violet",
  email: "bg-green-bg text-green",
  ocr: "bg-[#fcefe0] text-[#c2410c]",
  win: "bg-green text-white",
};

export function SleekPipeline({
  sellers,
  defaultOpenId = null,
}: {
  sellers: Seller[];
  defaultOpenId?: string | null;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpenId);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Sellers in pipeline</CardTitle>
        <span className="text-[11px] text-zinc-400">click a row to expand</span>
      </CardHeader>

      <div className="divide-y divide-zinc-100">
        {sellers.map((seller) => (
          <SellerRow
            key={seller.id}
            seller={seller}
            open={open === seller.id}
            onToggle={() =>
              setOpen((cur) => (cur === seller.id ? null : seller.id))
            }
          />
        ))}
      </div>
    </Card>
  );
}

function SellerRow({
  seller,
  open,
  onToggle,
}: {
  seller: Seller;
  open: boolean;
  onToggle: () => void;
}) {
  const ChannelIcon = channelIcon[seller.lastTouch.channel];
  const meta = stageMeta[seller.stage];

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "grid w-full grid-cols-[1.7fr_1fr_0.9fr_28px] items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-300 lg:grid-cols-[1.8fr_1.2fr_1fr_1.1fr_0.9fr_28px]",
          open && "bg-zinc-50",
        )}
      >
        {/* Seller */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            initials={seller.initials}
            className="text-white ring-0"
            style={{
              background: `linear-gradient(135deg, ${seller.avatarFrom}, ${seller.avatarTo})`,
            }}
          />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-zinc-900">
              {seller.company}
            </div>
            <div className="truncate text-[11.5px] text-zinc-400">
              {seller.contact} · {seller.location}
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="flex items-center gap-2 text-[12px] text-zinc-600">
          <span
            className="size-1.5 flex-none rounded-full"
            style={{ background: meta.dot }}
          />
          <span className="truncate">{meta.label}</span>
        </div>

        {/* Status */}
        <div>
          <Badge className={cn("border", statusTint[seller.status.variant])}>
            {seller.status.label}
          </Badge>
        </div>

        {/* Last touch */}
        <div className="hidden items-center gap-1.5 text-[12px] text-zinc-500 lg:flex">
          <ChannelIcon className="size-3.5 flex-none text-zinc-400" />
          <span className="truncate">{seller.lastTouch.label}</span>
        </div>

        {/* Complete */}
        <div className="hidden items-center gap-2 lg:flex">
          <Progress
            value={seller.completeness}
            className="flex-1"
            indicatorClassName="bg-wm-blue"
          />
          <span className="w-8 text-right text-[11px] font-medium tabular-nums text-zinc-500">
            {seller.completeness}%
          </span>
        </div>

        <ChevronDown
          className={cn(
            "size-4 justify-self-center text-zinc-400 transition-transform",
            open && "rotate-180 text-zinc-700",
          )}
        />
      </button>

      {open ? <SellerDetail seller={seller} /> : null}
    </div>
  );
}

function SellerDetail({ seller }: { seller: Seller }) {
  return (
    <div className="animate-detail-in border-t border-zinc-100 bg-zinc-50/50">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Record */}
        <div className="border-b border-zinc-100 p-5 lg:border-b-0 lg:border-r">
          {seller.recovery ? (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3">
              <ShieldCheck className="size-5 flex-none text-emerald-600" />
              <div>
                <div className="text-[13px] font-semibold text-zinc-900">
                  {seller.recovery.title}
                </div>
                <div className="text-[12px] text-zinc-500">
                  {seller.recovery.detail}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Record completeness
            </span>
            <span className="text-[12px] font-medium text-zinc-600">
              {seller.fieldsVerified} of 12 verified
            </span>
          </div>
          <Progress
            value={seller.completeness}
            className="mb-4"
            indicatorClassName="bg-gradient-to-r from-wm-blue to-green"
          />

          <dl>
            {seller.fields.map((field) => {
              const pending =
                field.note === "pending" || field.note === "needs review";
              return (
                <div
                  key={field.key}
                  className="flex items-center gap-3 border-b border-dashed border-zinc-200 py-2.5 last:border-b-0"
                >
                  {pending ? (
                    <TriangleAlert className="size-4 flex-none text-amber-500" />
                  ) : (
                    <Check className="size-4 flex-none text-emerald-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <dt className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">
                      {field.key}
                    </dt>
                    <dd
                      className={cn(
                        "mt-0.5 text-[13px] font-medium text-zinc-900",
                        field.mono && "font-mono",
                      )}
                    >
                      {field.value}
                    </dd>
                  </div>
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-medium",
                      sourcePill[field.source],
                    )}
                  >
                    {field.source}
                    {field.note ? ` · ${field.note}` : ""}
                  </span>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Timeline */}
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[12px] font-semibold text-zinc-900">
              Interaction timeline
            </h4>
            <Badge variant="outline" className="font-normal">
              {seller.timeline.length} events
            </Badge>
          </div>

          <ol>
            {seller.timeline.map((event, i) => (
              <TimelineRow
                key={i}
                event={event}
                last={i === seller.timeline.length - 1}
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ event, last }: { event: TimelineEvent; last: boolean }) {
  const Icon = timelineStyle[event.kind].icon;

  return (
    <li className="relative flex gap-3 py-2.5">
      {!last ? (
        <span className="absolute left-[15px] top-[34px] -bottom-2.5 w-px bg-zinc-200" />
      ) : null}
      <span
        className={cn(
          "z-[1] flex size-8 flex-none items-center justify-center rounded-full",
          timelineTint[event.kind],
        )}
        aria-hidden
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[12.5px] font-semibold text-zinc-900">
            {event.title}
          </span>
          <span className="flex-none whitespace-nowrap text-[10.5px] font-medium text-zinc-400">
            {event.time}
          </span>
        </div>

        {event.desc ? (
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-zinc-500">
            {event.desc}
          </p>
        ) : null}

        {event.quote ? (
          <p
            className={cn(
              "mt-1.5 rounded-r-md border-l-2 bg-white px-3 py-2 text-[11.5px] italic text-zinc-600",
              event.quote.agent ? "border-l-wm-blue" : "border-l-zinc-300",
            )}
          >
            {event.quote.text}
          </p>
        ) : null}

        {event.discrepancy ? (
          <div className="mt-1.5 overflow-hidden rounded-lg border border-zinc-200">
            <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 text-[10.5px] font-semibold text-rose-700">
              <TriangleAlert className="size-3.5" />
              {event.discrepancy.label}
            </div>
            <div className="grid grid-cols-2 divide-x divide-zinc-100 bg-white">
              <div className="px-3 py-2">
                <div className="text-[9.5px] font-semibold uppercase tracking-wide text-zinc-400">
                  Entered
                </div>
                <div className="mt-0.5 text-[12px] font-semibold text-rose-600">
                  {event.discrepancy.said}
                </div>
              </div>
              <div className="px-3 py-2">
                <div className="text-[9.5px] font-semibold uppercase tracking-wide text-zinc-400">
                  On filing
                </div>
                <div className="mt-0.5 text-[12px] font-semibold text-emerald-600">
                  {event.discrepancy.filing}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {event.tag ? (
          <Badge
            variant="outline"
            className={cn(
              "mt-1.5 font-normal",
              event.tag.tone === "good"
                ? "border-emerald-100 text-emerald-700"
                : "border-amber-100 text-amber-700",
            )}
          >
            {event.tag.text}
          </Badge>
        ) : null}

        {event.document ? (
          <div className="mt-2">
            <DocumentViewer doc={event.document} />
          </div>
        ) : null}
      </div>
    </li>
  );
}
