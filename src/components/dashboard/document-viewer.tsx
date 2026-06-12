"use client";

import type { ReactNode } from "react";
import { ScanLine, FileText, TriangleAlert, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ExtractedDocument, ExtractedField } from "@/lib/data";

const statusStyle: Record<
  ExtractedField["status"],
  { box: string; chip: string; ring: string }
> = {
  conflict: {
    box: "outline-amber bg-amber-bg/70",
    chip: "bg-amber text-white",
    ring: "text-amber",
  },
  match: {
    box: "outline-green bg-green-bg/60",
    chip: "bg-green text-white",
    ring: "text-green",
  },
  ok: {
    box: "outline-wm-blue bg-[#e7f0fb]/70",
    chip: "bg-wm-blue text-white",
    ring: "text-wm-blue",
  },
};

/** An OCR-detected value rendered inline on the document with a bounding box. */
function Detected({ field }: { field: ExtractedField }) {
  const s = statusStyle[field.status];
  return (
    <span
      className={cn(
        "relative mx-0.5 inline-block rounded-[3px] px-1 outline-2 -outline-offset-1",
        s.box,
      )}
    >
      {field.value}
      <span
        className={cn(
          "absolute -top-2 right-0 translate-x-1/3 rounded-full px-1.5 py-px font-mono text-[8.5px] font-bold leading-none shadow-sm",
          s.chip,
        )}
      >
        {field.confidence.toFixed(1)}%
      </span>
    </span>
  );
}

/** A labeled row on the certificate — bold green label, value to the right. */
function Row({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-[140px] flex-none font-bold">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

export function DocumentViewer({ doc }: { doc: ExtractedDocument }) {
  const byLabel = (label: string) =>
    doc.fields.find((f) => f.label === label)!;
  const avg =
    doc.fields.reduce((a, f) => a + f.confidence, 0) / doc.fields.length;
  const conflict = doc.fields.find((f) => f.status === "conflict");

  const taxpayer = byLabel("Taxpayer name");
  const address = byLabel("Address");
  const certNo = byLabel("Certificate number");
  const effective = byLabel("Effective date");
  const issuance = byLabel("Date of issuance");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-wm-blue transition hover:border-wm-blue/40 hover:bg-sky-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wm-blue"
        >
          <ScanLine className="size-3.5" />
          View document &amp; OCR read
        </button>
      </DialogTrigger>

      <DialogContent>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-5 py-3.5">
          <span className="flex size-9 flex-none items-center justify-center rounded-[10px] bg-[#c2410c] text-white">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="text-[14px] font-extrabold text-wm-ink">
              {doc.kind}
            </DialogTitle>
            <DialogDescription className="text-[11.5px] text-muted">
              {doc.jurisdiction} · {doc.docId}
            </DialogDescription>
          </div>
        </div>

        <div className="grid max-h-[calc(92dvh-58px)] grid-cols-1 overflow-auto lg:grid-cols-[1.25fr_1fr]">
          {/* LEFT — the "scanned" document with detected boxes */}
          <div className="border-b border-line bg-[#f1f4f9] p-6 lg:border-b-0 lg:border-r">
            <div className="mx-auto max-w-md border-[3px] border-[#1a6b3a] bg-white p-1.5 shadow-[0_8px_30px_rgba(16,42,82,0.12)]">
              <div className="border border-[#1a6b3a] px-6 py-5">
                {/* header — seal + title */}
                <div className="flex items-center gap-4 border-b-2 border-[#1a6b3a] pb-4">
                  <span className="flex size-14 flex-none items-center justify-center rounded-full border-[3px] border-[#1a6b3a] bg-[#eaf3ec] text-[#1a6b3a]">
                    <span className="font-serif text-[18px] font-extrabold leading-none">
                      NJ
                    </span>
                  </span>
                  <h4 className="font-serif text-[16px] font-extrabold uppercase leading-[1.15] tracking-tight text-[#1a6b3a]">
                    State of New Jersey
                    <br />
                    Business Registration Certificate
                  </h4>
                </div>

                {/* body — labeled rows */}
                <dl className="mt-5 space-y-3 font-serif text-[12.5px] text-[#1a6b3a]">
                  <Row label="Taxpayer Name:">
                    <Detected field={taxpayer} />
                  </Row>
                  <Row label="Trade Name:" />
                  <Row label="Address:">
                    <Detected field={address} />
                  </Row>
                  <Row label="Certificate Number:">
                    <Detected field={certNo} />
                  </Row>
                  <Row label="Effective Date:">
                    <Detected field={effective} />
                  </Row>
                  <Row label="Date of Issuance:">
                    <Detected field={issuance} />
                  </Row>
                </dl>

                {/* footer — office use only */}
                {doc.officeUseId ? (
                  <div className="mt-6 border-t-2 border-[#1a6b3a] pt-4 font-serif text-[12.5px] text-[#1a6b3a]">
                    <div className="font-bold">For Office Use Only:</div>
                    <div className="mt-1.5 font-mono text-[13px]">
                      {doc.officeUseId}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* RIGHT — extraction summary */}
          <div className="bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.3px] text-wm-ink">
                <ScanLine className="size-4 text-[#c2410c]" />
                OCR extraction
              </h3>
              <span className="rounded-full bg-green-bg px-2.5 py-1 font-mono text-[11px] font-bold text-green">
                {avg.toFixed(1)}% avg
              </span>
            </div>

            <dl className="space-y-3">
              {doc.fields.map((f) => {
                const s = statusStyle[f.status];
                return (
                  <div
                    key={f.label}
                    className="rounded-[10px] border border-line bg-surface-2 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[10.5px] font-semibold uppercase tracking-[0.3px] text-muted">
                        {f.label}
                      </dt>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-[10px] font-bold",
                          s.ring,
                        )}
                      >
                        {f.status === "conflict" ? (
                          <>
                            <TriangleAlert className="size-3" /> Conflict
                          </>
                        ) : (
                          <>
                            <Check className="size-3" />{" "}
                            {f.status === "match" ? "Matched" : "Read"}
                          </>
                        )}
                      </span>
                    </div>
                    <dd className="mt-1 text-[13px] font-bold text-ink">
                      {f.value}
                    </dd>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded bg-[#e3eaf3]">
                        <div
                          className={cn(
                            "h-full rounded",
                            f.status === "conflict"
                              ? "bg-amber"
                              : f.status === "match"
                                ? "bg-green"
                                : "bg-wm-blue",
                          )}
                          style={{ width: `${f.confidence}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono text-[10px] font-bold text-muted">
                        {f.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </dl>

            {conflict ? (
              <div className="mt-4 overflow-hidden rounded-[10px] border border-[#f3c9c9]">
                <div className="flex items-center gap-1.5 bg-red-bg px-3 py-2 text-[10.5px] font-bold text-[#9b1c1c]">
                  <TriangleAlert className="size-3.5" />
                  {conflict.label}: form vs. filing
                </div>
                <div className="grid grid-cols-2 gap-px bg-line">
                  <div className="bg-white px-3 py-2.5">
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.3px] text-muted">
                      Said on call
                    </div>
                    <div className="mt-0.5 text-[12px] font-bold text-red">
                      {conflict.conflictWith}
                    </div>
                  </div>
                  <div className="bg-white px-3 py-2.5">
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.3px] text-muted">
                      On this filing
                    </div>
                    <div className="mt-0.5 text-[12px] font-bold text-green">
                      {conflict.value}
                    </div>
                  </div>
                </div>
                <div className="bg-green-bg px-3 py-2 text-[10.5px] font-semibold text-[#0e6b30]">
                  Auto-flagged before submission · resolved on the Day 5 callback
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
