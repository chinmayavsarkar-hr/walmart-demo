import {
  Bot,
  Check,
  Mail,
  MessageSquare,
  Monitor,
  Phone,
  ScanLine,
  type LucideIcon,
} from "lucide-react";
import type { Channel, FieldSource, TimelineEvent } from "@/lib/data";

export const channelIcon: Record<Channel, LucideIcon> = {
  voice: Phone,
  sms: MessageSquare,
  email: Mail,
  ocr: ScanLine,
  portal: Monitor,
  system: Bot,
};

/** Background + ring styling for each timeline node. */
export const timelineStyle: Record<
  TimelineEvent["kind"],
  { icon: LucideIcon; className: string }
> = {
  portal: { icon: Monitor, className: "bg-[#94A3B8]" },
  agent: {
    icon: Bot,
    className: "bg-wm-ink shadow-[0_0_0_3px_var(--spark)]",
  },
  call: { icon: Phone, className: "bg-wm-blue" },
  sms: { icon: MessageSquare, className: "bg-violet" },
  email: { icon: Mail, className: "bg-green" },
  ocr: { icon: ScanLine, className: "bg-[#C2410C]" },
  win: { icon: Check, className: "bg-green shadow-[0_0_0_3px_#BBE8CC]" },
};

/** Human label per channel. */
export const channelName: Record<Channel, string> = {
  voice: "Voice",
  sms: "SMS",
  email: "Email",
  ocr: "Document OCR",
  portal: "Portal",
  system: "System",
};

/** Solid brand color per channel — used by bars and chips. */
export const channelColor: Record<Channel, string> = {
  voice: "#0071dc",
  sms: "#6b3fd4",
  email: "#15a34a",
  ocr: "#c2410c",
  portal: "#94a3b8",
  system: "#64748b",
};

export const sourcePill: Record<FieldSource, string> = {
  voice: "bg-[#e7f0fb] text-wm-blue",
  sms: "bg-violet-bg text-violet",
  email: "bg-green-bg text-green",
  ocr: "bg-[#fcefe0] text-[#c2410c]",
  platform: "bg-[#e6ebf4] text-wm-ink",
};
