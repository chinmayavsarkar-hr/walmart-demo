import { ChannelMix } from "@/components/dashboard/channel-mix";
import { Funnel } from "@/components/dashboard/funnel";
import { Kpis } from "@/components/dashboard/kpis";
import { Pipeline } from "@/components/dashboard/pipeline";
import { StallReasons } from "@/components/dashboard/stall-reasons";
import { Topbar } from "@/components/dashboard/topbar";
import { sellers } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-bg">
      <Topbar />

      <main className="mx-auto max-w-[1500px] px-6 pb-12 pt-5">
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-[19px] font-extrabold tracking-[-0.3px] text-wm-ink">
            New Seller Acquisition
          </h1>
          <span className="text-[12.5px] text-muted">
            250-seller pilot cohort · last 30 days
          </span>
          <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[11.5px] font-semibold text-muted shadow-card">
            <span className="size-[7px] rounded-full bg-everyday-blue shadow-[0_0_0_3px_rgba(77,189,245,0.25)]" />
            Live
          </span>
        </div>

        {/* Act 1 — the outcome */}
        <div className="mb-4">
          <Kpis />
        </div>

        {/* Act 2 — the operating system (left rail) + the lived record (right) */}
        <div className="grid items-start gap-4 lg:grid-cols-[340px_1fr]">
          <div className="grid gap-4">
            <Funnel />
            <StallReasons />
          </div>
          <Pipeline sellers={sellers} />
        </div>

        {/* Act 3 — the close: where the work actually happens (anti-outbound) */}
        <div className="mt-4">
          <div className="mb-2 flex items-baseline gap-3">
            <h2 className="text-[14px] font-extrabold tracking-[-0.2px] text-wm-ink">
              Where the work actually happens
            </h2>
            <span className="text-[12px] text-muted">
              every touch below lands after the lead exists
            </span>
          </div>
          <ChannelMix />
        </div>
      </main>
    </div>
  );
}
