import { LogOut } from "lucide-react";
import { logout } from "@/app/actions";
import { HappyRobotLogo } from "@/components/brand/happyrobot-logo";
import { WalmartMarketplaceLogo } from "@/components/brand/walmart-marketplace-logo";
import { getCurrentUser } from "@/lib/auth";

function initialsFrom(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function Topbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center gap-4 bg-wm-ink px-6 text-white">
      {/* Brand lockup: Walmart Marketplace | HappyRobot */}
      <div className="flex items-center gap-4">
        <WalmartMarketplaceLogo className="h-[21px] w-auto" />
        <span className="h-7 w-px bg-white/25" />
        <HappyRobotLogo className="h-[26px] w-auto" />
      </div>

      {/* Logged-in operator */}
      {user ? (
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-[12.5px] font-semibold">{user.name}</div>
            <div className="text-[10.5px] text-[#9db6e0]">{user.email}</div>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-white/12 text-[12px] font-bold text-white ring-1 ring-white/15">
            {initialsFrom(user.name)}
          </div>
          <form action={logout}>
            <button
              type="submit"
              title="Sign out"
              className="flex size-8 items-center justify-center rounded-full text-[#b9cbea] transition hover:bg-white/12 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark"
            >
              <LogOut className="size-4" />
              <span className="sr-only">Sign out</span>
            </button>
          </form>
        </div>
      ) : null}
    </header>
  );
}
