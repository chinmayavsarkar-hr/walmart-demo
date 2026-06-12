"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions";
import { HappyRobotLogo } from "@/components/brand/happyrobot-logo";
import { WalmartMarketplaceLogo } from "@/components/brand/walmart-marketplace-logo";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { DEMO_CREDENTIALS } from "@/lib/auth-public";

const stats = [
  { value: "38%", label: "prospect → active rate" },
  { value: "4.1 days", label: "avg. time to active" },
  { value: "61", label: "stalls recovered" },
];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand / value panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-wm-ink p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #ffc220, transparent)" }}
        />
        <div className="flex items-center gap-4">
          <WalmartMarketplaceLogo className="h-[22px] w-auto" />
          <span className="h-7 w-px bg-white/25" />
          <HappyRobotLogo className="h-[27px] w-auto" />
        </div>

        <div className="relative max-w-md">
          <h1 className="text-[42px] font-extrabold leading-[1.04] tracking-[-1px]">
            Turn abandoned signups into{" "}
            <span className="text-spark">active sellers.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#b9cbea]">
            One AI agent works every lead across voice, SMS, email, and document
            OCR — catching the mismatches that stall verification before they
            ever reach review.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-spark">
                  {s.value}
                </div>
                <div className="mt-1 text-[11.5px] leading-snug text-[#9db6e0]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-[11.5px] text-[#7e97c8]">
          Pilot cohort · 250 sellers · Live environment
        </div>
      </aside>

      {/* Sign-in panel */}
      <main className="flex items-center justify-center bg-bg px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Spark />
            <b className="text-[15px] font-bold text-wm-ink">
              Marketplace Seller Acquisition
            </b>
          </div>

          <h2 className="text-[22px] font-extrabold tracking-tight text-wm-ink">
            Sign in
          </h2>
          <p className="mt-1.5 text-[13.5px] text-muted">
            Access the seller acquisition pipeline.
          </p>

          <form action={formAction} className="mt-7 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-[12px] font-semibold text-wm-ink"
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                defaultValue={DEMO_CREDENTIALS.email}
                className="w-full rounded-[10px] border border-line-dk bg-surface px-3.5 py-2.5 text-[14px] text-ink outline-none transition focus:border-wm-blue focus:ring-2 focus:ring-wm-blue/20"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-[12px] font-semibold text-wm-ink"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-[10px] border border-line-dk bg-surface px-3.5 py-2.5 text-[14px] text-ink outline-none transition focus:border-wm-blue focus:ring-2 focus:ring-wm-blue/20"
              />
            </div>

            {state.error ? (
              <p
                role="alert"
                className="rounded-[10px] bg-red-bg px-3.5 py-2.5 text-[12.5px] font-medium text-red"
              >
                {state.error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={pending}
              className="w-full py-3 text-[14px]"
            >
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-[10px] border border-dashed border-line-dk bg-surface-2 px-4 py-3 text-[12px] text-muted">
            <span className="font-semibold text-wm-ink">Demo login</span> —
            pre-filled above.{" "}
            <span className="font-mono text-[11.5px] text-ink">
              {DEMO_CREDENTIALS.email}
            </span>{" "}
            /{" "}
            <span className="font-mono text-[11.5px] text-ink">
              {DEMO_CREDENTIALS.password}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
