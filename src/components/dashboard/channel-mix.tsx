import { Card } from "@/components/ui/card";
import { channelMix } from "@/lib/data";
import { channelIcon } from "./icons";

// Monochrome blue scale (Bentonville → True → Everyday → Sky) keeps the
// segments distinguishable without four competing hues.
const blueScale = ["#001E60", "#0071DC", "#4DBDF5", "#A9DDF7"];

export function ChannelMix() {
  const max = Math.max(...channelMix.byChannel.map((c) => c.count));

  return (
    <Card className="p-5">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_auto_1fr] lg:gap-8">
        {/* Touch volume by channel */}
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[12.5px] font-bold uppercase tracking-[0.3px] text-wm-ink">
              Channel mix
            </h2>
            <span className="text-[11px] font-medium text-muted">
              {channelMix.totalTouches.toLocaleString()} touches ·{" "}
              {channelMix.sellers} sellers
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {channelMix.byChannel.map((c) => {
              const Icon = channelIcon[c.channel];
              return (
                <div key={c.channel}>
                  <div className="flex items-center gap-1.5 text-muted">
                    <Icon className="size-3.5 text-faint" />
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.3px]">
                      {c.label}
                    </span>
                  </div>
                  <div className="mt-1 text-[22px] font-extrabold leading-none tracking-[-0.5px] text-wm-ink">
                    {c.count.toLocaleString()}
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-[#e3eaf3]">
                    <div
                      className="h-full rounded bg-wm-blue"
                      style={{ width: `${(c.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden w-px bg-line lg:block" />

        {/* What closed the conversions */}
        <div>
          <h2 className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.3px] text-wm-ink">
            What sealed each conversion
          </h2>

          <div className="flex h-3 overflow-hidden rounded-full">
            {channelMix.closedBy.map((c, i) => (
              <div
                key={c.channel}
                title={`${c.label} · ${c.pct}%`}
                style={{
                  width: `${c.pct}%`,
                  background: blueScale[i % blueScale.length],
                }}
              />
            ))}
          </div>

          <ul className="mt-3 space-y-1.5">
            {channelMix.closedBy.map((c, i) => (
              <li
                key={c.channel}
                className="flex items-center gap-2 text-[11.5px]"
              >
                <span
                  className="size-2.5 flex-none rounded-[3px]"
                  style={{ background: blueScale[i % blueScale.length] }}
                />
                <span className="text-ink">{c.label}</span>
                <span className="ml-auto font-mono font-bold text-muted">
                  {c.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
