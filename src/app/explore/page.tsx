import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FunnelExplorer } from "@/components/explore/funnel-explorer";
import { Kpis } from "@/components/dashboard/kpis";
import { Topbar } from "@/components/dashboard/topbar";
import { sellers } from "@/lib/data";

export default function ExplorePage() {
  return (
    <div className="min-h-dvh bg-bg">
      <Topbar />

      <main className="mx-auto max-w-[1500px] px-6 pb-12 pt-5">
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-[19px] font-extrabold tracking-[-0.3px] text-wm-ink">
            Funnel Explorer
          </h1>
          <span className="text-[12.5px] text-muted">
            click any stage for an AI breakdown · prototype
          </span>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[11.5px] font-semibold text-muted shadow-card transition hover:text-wm-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wm-blue"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
        </div>

        <div className="mb-4">
          <Kpis />
        </div>

        <FunnelExplorer sellers={sellers} />
      </main>
    </div>
  );
}
