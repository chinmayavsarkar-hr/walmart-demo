import { ChannelMix } from "@/components/dashboard/channel-mix";
import { Topbar } from "@/components/dashboard/topbar";
import { FunnelExplorer } from "@/components/explore2/funnel-explorer";
import { SleekKpis } from "@/components/explore2/kpis";
import { sellers } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-bg">
      <Topbar />

      <main className="mx-auto max-w-[1500px] px-6 pb-12 pt-6">
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-[20px] font-semibold tracking-tight text-zinc-900">
            New Seller Acquisition
          </h1>
          <span className="text-[13px] text-zinc-500">
            250-seller pilot cohort · last 30 days
          </span>
          <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11.5px] font-medium text-zinc-500 shadow-sm">
            <span className="size-[7px] rounded-full bg-everyday-blue shadow-[0_0_0_3px_rgba(77,189,245,0.25)]" />
            Live
          </span>
        </div>

        <div className="mb-4">
          <SleekKpis />
        </div>

        <div className="mb-4">
          <ChannelMix />
        </div>

        <FunnelExplorer sellers={sellers} />
      </main>
    </div>
  );
}
