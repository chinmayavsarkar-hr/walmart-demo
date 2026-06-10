"use client";

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

export function DocumentViewer({ doc }: { doc: ExtractedDocument }) {
  const byLabel = (label: string) =>
    doc.fields.find((f) => f.label === label)!;
  const avg =
    doc.fields.reduce((a, f) => a + f.confidence, 0) / doc.fields.length;
  const conflict = doc.fields.find((f) => f.status === "conflict");

  const name = byLabel("Legal business name");
  const entity = byLabel("Entity type");
  const jurisdiction = byLabel("Jurisdiction");
  const agent = byLabel("Registered agent");
  const ein = byLabel("EIN / Tax ID");
  const filed = byLabel("Date filed");

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
            <div className="mx-auto max-w-md rounded-[6px] border border-line-dk bg-white px-9 py-10 shadow-[0_8px_30px_rgba(16,42,82,0.12)]">
              {/* seal */}
              <div className="mb-6 flex flex-col items-center text-center">
                <span className="mb-3 flex size-12 items-center justify-center rounded-full border-[3px] border-[#0e6b30] text-[#0e6b30]">
                  <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                    <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.9 7.2 16.4l.9-5.3L4.3 7.6l5.3-.8z" />
                  </svg>
                </span>
                <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-muted">
                  {doc.jurisdiction.split("·")[0].trim()}
                </div>
                <h4 className="mt-1 font-serif text-[19px] font-bold tracking-tight text-[#1a1a1a]">
                  Certificate of Formation
                </h4>
                <div className="mt-0.5 font-mono text-[9px] text-faint">
                  {doc.docId}
                </div>
              </div>

              <div className="space-y-3.5 font-serif text-[12.5px] leading-[2] text-[#2a2a2a]">
                <p>
                  The undersigned, for the purpose of forming a limited liability
                  company under the laws of the State of Oregon, hereby certifies
                  that the name of the company is <Detected field={name} />.
                </p>
                <p>
                  The entity is organized as a <Detected field={entity} /> in{" "}
                  <Detected field={jurisdiction} />, with{" "}
                  <Detected field={agent} /> designated as registered agent.
                </p>
                <p>
                  Federal Employer Identification Number{" "}
                  <Detected field={ein} />, filed and effective as of{" "}
                  <Detected field={filed} />.
                </p>
              </div>

              <div className="mt-8 flex items-end justify-between border-t border-dashed border-line pt-4">
                <div className="font-[cursive] text-[16px] text-[#1a1a1a]">
                  Dana Reyes
                </div>
                <div className="text-right font-mono text-[8.5px] uppercase tracking-wide text-faint">
                  Authorized signature
                </div>
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
