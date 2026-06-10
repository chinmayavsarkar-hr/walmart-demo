"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck, TriangleAlert } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { stageMeta, type Seller } from "@/lib/data";
import { channelIcon, sourcePill, timelineStyle } from "./icons";
import { DocumentViewer } from "./document-viewer";

export function Pipeline({
  sellers,
  defaultOpenId = sellers[0]?.id ?? null,
}: {
  sellers: Seller[];
  /** which row starts expanded; pass `null` for all-collapsed */
  defaultOpenId?: string | null;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpenId);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Sellers in pipeline</CardTitle>
        <span className="text-[11px] font-semibold text-faint">
          click a row to expand
        </span>
      </CardHeader>

      {/* Column header */}
      <div className="grid grid-cols-[1.6fr_1fr_0.9fr_24px] items-center gap-3 border-b border-line bg-surface-2 px-[18px] py-[11px] lg:grid-cols-[1.7fr_1.3fr_1fr_1.1fr_0.9fr_28px]">
        <HeaderCell>Seller</HeaderCell>
        <HeaderCell>Stage</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell className="hidden lg:block">Last touch</HeaderCell>
        <HeaderCell className="hidden lg:block">Complete</HeaderCell>
        <span />
      </div>

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
    </Card>
  );
}

function HeaderCell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-[10.5px] font-bold uppercase tracking-[0.4px] text-muted",
        className,
      )}
    >
      {children}
    </span>
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
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "grid w-full grid-cols-[1.6fr_1fr_0.9fr_24px] items-center gap-3 px-[18px] py-[13px] text-left text-[13px] transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-wm-blue lg:grid-cols-[1.7fr_1.3fr_1fr_1.1fr_0.9fr_28px]",
          open && "bg-sky-tint",
        )}
      >
        {/* Seller */}
        <div className="flex min-w-0 items-center gap-[11px]">
          <Avatar
            initials={seller.initials}
            style={{
              background: `linear-gradient(135deg, ${seller.avatarFrom}, ${seller.avatarTo})`,
            }}
          />
          <div className="min-w-0">
            <div className="truncate font-bold text-wm-ink">
              {seller.company}
            </div>
            <div className="text-[11px] font-medium text-faint">
              {seller.contact} · {seller.location}
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink">
          <span
            className="size-[7px] flex-none rounded-full"
            style={{ background: meta.dot }}
          />
          <span className="truncate">{meta.label}</span>
        </div>

        {/* Status */}
        <div>
          <Badge variant={seller.status.variant}>{seller.status.label}</Badge>
        </div>

        {/* Last touch */}
        <div className="hidden items-center gap-1.5 text-[12px] text-muted lg:flex">
          <ChannelIcon className="size-3.5 flex-none" />
          <span className="truncate">{seller.lastTouch.label}</span>
        </div>

        {/* Complete */}
        <div className="hidden items-center gap-2 lg:flex">
          <Progress value={seller.completeness} className="flex-1" />
          <span className="w-[30px] text-right text-[11px] font-bold text-muted">
            {seller.completeness}%
          </span>
        </div>

        <ChevronDown
          className={cn(
            "size-5 justify-self-center text-faint transition-transform duration-200",
            open && "rotate-180 text-wm-blue",
          )}
        />
      </button>

      {open ? <SellerDetail seller={seller} /> : null}
    </div>
  );
}

function SellerDetail({ seller }: { seller: Seller }) {
  return (
    <div className="animate-detail-in border-t border-line bg-[#fbfcfe]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT — record */}
        <div className="border-b border-line px-[22px] py-5 lg:border-b-0 lg:border-r">
          {seller.recovery ? (
            <div className="mb-4 flex items-center gap-3 rounded-[11px] border border-[#b6e3c6] bg-green-bg px-[15px] py-[13px]">
              <div className="flex size-[38px] flex-none items-center justify-center rounded-[10px] bg-green text-white">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <b className="block text-sm text-[#0e6b30]">
                  {seller.recovery.title}
                </b>
                <span className="text-[12px] text-[#1b7d42]">
                  {seller.recovery.detail}
                </span>
              </div>
            </div>
          ) : null}

          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3px] text-muted">
              Record completeness
            </span>
            <span className="text-[12.5px] font-bold text-green">
              {seller.fieldsVerified} of 12 verified
            </span>
          </div>
          <Progress
            value={seller.completeness}
            className="mb-4 h-[7px]"
            barClassName="to-green"
          />

          <dl>
            {seller.fields.map((field) => {
              const pending =
                field.note === "pending" || field.note === "needs review";
              return (
                <div
                  key={field.key}
                  className="flex items-center gap-[11px] border-b border-dashed border-line py-[9px] last:border-b-0"
                >
                  <span
                    className={cn(
                      "flex size-[21px] flex-none items-center justify-center rounded-md text-white",
                      pending ? "bg-amber" : "bg-green",
                    )}
                    aria-hidden
                  >
                    {pending ? (
                      <TriangleAlert className="size-3" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <dt className="text-[10.5px] font-semibold uppercase tracking-[0.3px] text-muted">
                      {field.key}
                    </dt>
                    <dd
                      className={cn(
                        "mt-px text-[13px] font-semibold text-ink",
                        field.mono && "font-mono",
                      )}
                    >
                      {field.value}
                    </dd>
                  </div>
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-full px-2 py-[3px] text-[10px] font-bold",
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

        {/* RIGHT — timeline */}
        <div className="px-[22px] py-5">
          <h3 className="mb-3.5 flex items-center justify-between text-[12px] font-bold uppercase tracking-[0.3px] text-wm-ink">
            Interaction timeline
            <span className="rounded-full bg-green-bg px-[9px] py-[3px] text-[10.5px] font-bold normal-case tracking-normal text-green">
              {seller.timeline.length} events
            </span>
          </h3>

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

function TimelineRow({
  event,
  last,
}: {
  event: Seller["timeline"][number];
  last: boolean;
}) {
  const style = timelineStyle[event.kind];
  const Icon = style.icon;

  return (
    <li className="relative flex gap-3 py-[11px]">
      {!last ? (
        <span className="absolute left-[15px] top-[34px] -bottom-[11px] w-0.5 bg-line" />
      ) : null}
      <span
        className={cn(
          "z-[1] flex size-8 flex-none items-center justify-center rounded-[9px] text-white",
          style.className,
        )}
        aria-hidden
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1 pt-px">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[12.5px] font-bold text-wm-ink">
            {event.title}
          </span>
          <span className="flex-none whitespace-nowrap text-[10px] font-semibold text-faint">
            {event.time}
          </span>
        </div>

        {event.desc ? (
          <p className="mt-0.5 text-[11.5px] leading-[1.45] text-muted">
            {event.desc}
          </p>
        ) : null}

        {event.quote ? (
          <p
            className={cn(
              "mt-1.5 rounded-r-lg border-l-[3px] bg-white px-[11px] py-2 text-[11.5px] italic text-ink",
              event.quote.agent
                ? "border-l-spark border-y border-r border-line"
                : "border-l-wm-blue border-y border-r border-line",
            )}
          >
            {event.quote.text}
          </p>
        ) : null}

        {event.discrepancy ? (
          <div className="mt-1.5 overflow-hidden rounded-[10px] border border-[#f3c9c9]">
            <div className="flex items-center gap-1.5 bg-red-bg px-[11px] py-1.5 text-[10.5px] font-bold text-[#9b1c1c]">
              <TriangleAlert className="size-3.5" />
              {event.discrepancy.label}
            </div>
            <div className="grid grid-cols-2 gap-px bg-line">
              <div className="bg-white px-[11px] py-2.5">
                <div className="text-[9.5px] font-bold uppercase tracking-[0.3px] text-muted">
                  Entered
                </div>
                <div className="mt-0.5 text-[12px] font-bold text-red">
                  {event.discrepancy.said}
                </div>
              </div>
              <div className="bg-white px-[11px] py-2.5">
                <div className="text-[9.5px] font-bold uppercase tracking-[0.3px] text-muted">
                  On filing
                </div>
                <div className="mt-0.5 text-[12px] font-bold text-green">
                  {event.discrepancy.filing}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {event.tag ? (
          <span
            className={cn(
              "mt-1.5 inline-flex items-center gap-1.5 rounded-full px-[9px] py-[3px] text-[10px] font-bold",
              event.tag.tone === "good"
                ? "bg-green-bg text-green"
                : "bg-[#fcefe0] text-[#c2410c]",
            )}
          >
            {event.tag.text}
          </span>
        ) : null}

        {event.document ? (
          <div>
            <DocumentViewer doc={event.document} />
          </div>
        ) : null}
      </div>
    </li>
  );
}
