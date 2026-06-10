import type { BadgeVariant } from "@/components/ui/badge";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type StageKey =
  | "outreach"
  | "qualified"
  | "verification"
  | "submitted"
  | "active";

export type Channel = "voice" | "sms" | "email" | "ocr" | "portal" | "system";

export type FieldSource = "voice" | "sms" | "email" | "ocr";

export interface Field {
  key: string;
  value: string;
  source: FieldSource;
  mono?: boolean;
  note?: string;
}

export interface ExtractedField {
  label: string;
  value: string;
  /** OCR confidence, 0–100 */
  confidence: number;
  status: "match" | "conflict" | "ok";
  /** for a conflict, what the seller had said elsewhere */
  conflictWith?: string;
}

export interface ExtractedDocument {
  kind: string;
  jurisdiction: string;
  filedDate: string;
  docId: string;
  fields: ExtractedField[];
}

export interface TimelineEvent {
  kind: "portal" | "agent" | "call" | "sms" | "email" | "ocr" | "win";
  title: string;
  time: string;
  desc?: string;
  quote?: { text: string; agent?: boolean };
  tag?: { text: string; tone: "good" | "flag" };
  discrepancy?: { label: string; said: string; filing: string };
  /** when present, the timeline node exposes a "View document" action */
  document?: ExtractedDocument;
}

export interface Seller {
  id: string;
  company: string;
  contact: string;
  location: string;
  initials: string;
  avatarFrom: string;
  avatarTo: string;
  stage: StageKey;
  status: { label: string; variant: BadgeVariant };
  lastTouch: { channel: Channel; label: string };
  completeness: number;
  /** headline shown in the green recovery banner, if any */
  recovery?: { title: string; detail: string };
  fields: Field[];
  fieldsVerified: number;
  timeline: TimelineEvent[];
}

export interface Stage {
  /** unique, stable id used to look up the stage's AI insight */
  id: string;
  key: StageKey;
  name: string;
  count: number;
  pct?: number;
  /** Bar width and gradient — colocated so reordering stages can't desync them. */
  width: string;
  grad: string;
}

/* ------------------------------------------------------------------ *
 * Cohort KPIs + funnel
 * ------------------------------------------------------------------ */

export const kpis = [
  {
    label: "Leads in pipeline",
    value: "250",
    delta: "Sourced & enriched",
  },
  {
    label: "Prospect → active rate",
    value: "38",
    unit: "%",
    delta: "▲ from 20% baseline",
  },
  {
    label: "Avg. time to active",
    value: "4.1",
    unit: "days",
    delta: "▼ from ~26 days",
  },
  {
    label: "Recovered from stall",
    value: "61",
    delta: "Would have dropped off",
    accent: true,
  },
] as const;

export const funnel: Stage[] = [
  { id: "form-started", key: "outreach", name: "Form started", count: 250, width: "100%", grad: "linear-gradient(135deg,#0071DC,#0a63b8)" },
  { id: "ai-outreach", key: "outreach", name: "AI outreach triggered", count: 250, pct: 100, width: "90%", grad: "linear-gradient(135deg,#1f7fd6,#1769b3)" },
  { id: "qualified", key: "qualified", name: "Contacted & qualified", count: 188, pct: 75, width: "79%", grad: "linear-gradient(135deg,#3f8fcf,#2d77b8)" },
  { id: "verification", key: "verification", name: "Docs & verification", count: 134, pct: 54, width: "67%", grad: "linear-gradient(135deg,#5e9ed2,#4684bd)" },
  { id: "submitted", key: "submitted", name: "Submitted for approval", count: 108, pct: 43, width: "56%", grad: "linear-gradient(135deg,#7fb0d8,#5d93c4)" },
  { id: "active", key: "active", name: "Active seller", count: 95, pct: 38, width: "46%", grad: "linear-gradient(135deg,#15A34A,#0e8a3d)" },
];

export const stageMeta: Record<StageKey, { label: string; dot: string }> = {
  outreach: { label: "AI outreach", dot: "var(--muted)" },
  qualified: { label: "Contacted & qualified", dot: "var(--wm-blue)" },
  verification: { label: "Docs & verification", dot: "var(--amber)" },
  submitted: { label: "Submitted for approval", dot: "var(--wm-blue)" },
  active: { label: "Active seller", dot: "var(--green)" },
};

/* ------------------------------------------------------------------ *
 * Channel mix — the multi-channel work that happens AFTER the lead
 * exists (the back three-quarters of the funnel).
 * ------------------------------------------------------------------ */

export interface ChannelStat {
  channel: Channel;
  label: string;
  count: number;
}

export const channelMix: {
  totalTouches: number;
  sellers: number;
  byChannel: ChannelStat[];
  /** how the 95 active sellers were ultimately closed, by last decisive channel */
  closedBy: { channel: Channel; label: string; pct: number }[];
} = {
  totalTouches: 1194,
  sellers: 250,
  byChannel: [
    { channel: "voice", label: "Calls placed", count: 412 },
    { channel: "sms", label: "SMS sent", count: 380 },
    { channel: "email", label: "Emails sent", count: 268 },
    { channel: "ocr", label: "Documents OCR'd", count: 134 },
  ],
  closedBy: [
    { channel: "voice", label: "Inbound / callback", pct: 43 },
    { channel: "email", label: "Email + document", pct: 29 },
    { channel: "sms", label: "SMS nudge", pct: 19 },
    { channel: "ocr", label: "OCR auto-fix", pct: 9 },
  ],
};

/* ------------------------------------------------------------------ *
 * Stall reasons — why the 23 stuck at verification are stuck, and how
 * the agent works each one. Sums to 23.
 * ------------------------------------------------------------------ */

export interface StallReason {
  reason: string;
  count: number;
  resolution: string;
  channel: Channel;
}

export const stalledTotal = 23;

export const stallReasons: StallReason[] = [
  {
    reason: "Tax ID / EIN mismatch",
    count: 9,
    resolution: "Re-OCR the IRS letter, confirm digits on a call",
    channel: "ocr",
  },
  {
    reason: "Business-name mismatch",
    count: 6,
    resolution: "Match to the filing, proactive SMS heads-up",
    channel: "ocr",
  },
  {
    reason: "Missing reseller certificate",
    count: 5,
    resolution: "Email document request with one-tap upload link",
    channel: "email",
  },
  {
    reason: "Payout / banking setup",
    count: 3,
    resolution: "Guided Marketplace Wallet linking on a call",
    channel: "voice",
  },
];

/* ------------------------------------------------------------------ *
 * Per-stage AI overviews — staged "Twin" analysis surfaced when a
 * funnel layer is clicked in the Funnel Explorer (/explore).
 * ------------------------------------------------------------------ */

export interface StageInsight {
  headline: string;
  narrative: string;
  metrics: { label: string; value: string; sub?: string }[];
  /** why sellers leak out of this stage; empty for the terminal stage */
  dropoff: { reason: string; pct: number }[];
  /** outreach effectiveness at this stage, 0–100, ordered best-first */
  channels: { channel: Channel; effectiveness: number; note: string }[];
  recommendation: string;
}

export const funnelInsights: Record<string, StageInsight> = {
  "form-started": {
    headline:
      "The single biggest leak — most abandonment happens right here, at the verification wall.",
    narrative:
      "All 250 sellers begin the self-serve application, but a large share stop the moment they reach business and tax verification. At that point we usually have only a name and a phone number — no account is ever created, so these leads are invisible to a normal CRM.",
    metrics: [
      { label: "Entered application", value: "250" },
      { label: "Abandon before account", value: "~62%", sub: "at the EIN step" },
      { label: "Data captured", value: "Name + phone", sub: "only" },
    ],
    dropoff: [
      { reason: "Hit the EIN / business-verification step", pct: 62 },
      { reason: "Unclear value or time required", pct: 21 },
      { reason: "Distracted / mobile drop-off", pct: 17 },
    ],
    channels: [
      { channel: "sms", effectiveness: 88, note: "Fastest way to re-open a closed tab" },
      { channel: "voice", effectiveness: 74, note: "Best once a callback window is set" },
      { channel: "email", effectiveness: 41, note: "Low — no email captured yet" },
    ],
    recommendation:
      "Trigger the agent within minutes of abandonment, while intent is still warm. Speed-to-outreach is the highest-leverage lever in the entire funnel.",
  },
  "ai-outreach": {
    headline:
      "Every abandoned lead gets worked — no one is dropped for lack of follow-up.",
    narrative:
      "The agent opens a multi-channel cadence across all 250 leads. The constraint here isn't effort, it's reachability — the gap between leads worked and leads actually reached defines the next stage.",
    metrics: [
      { label: "Leads in outreach", value: "250" },
      { label: "Reached & qualified", value: "188", sub: "75%" },
      { label: "Avg. attempts to reach", value: "2.3" },
    ],
    dropoff: [
      { reason: "Never reachable across channels", pct: 54 },
      { reason: "Wrong / disconnected number", pct: 28 },
      { reason: "Explicitly opted out", pct: 18 },
    ],
    channels: [
      { channel: "sms", effectiveness: 84, note: "Opens a reply window without a live pickup" },
      { channel: "voice", effectiveness: 79, note: "Highest qualify-rate once connected" },
      { channel: "email", effectiveness: 52, note: "Useful only after an email is captured" },
    ],
    recommendation:
      "Lead with SMS to earn a callback window, then call. This two-step cadence beats call-first by a wide margin on cold recoveries.",
  },
  qualified: {
    headline:
      "Reached and qualified — momentum is high, but document friction is the next wall.",
    narrative:
      "Sellers here have confirmed entity, fulfillment and product basics on a call. The risk shifts from reachability to follow-through: getting documents uploaded before momentum fades.",
    metrics: [
      { label: "Contacted & qualified", value: "188" },
      { label: "Advance to verification", value: "134", sub: "71% of stage" },
      { label: "Avg. fields captured live", value: "4.6" },
    ],
    dropoff: [
      { reason: "Document upload friction", pct: 44 },
      { reason: "Tax-ID / EIN confusion", pct: 33 },
      { reason: "Lost momentum before reply", pct: 23 },
    ],
    channels: [
      { channel: "voice", effectiveness: 91, note: "Closes information gaps in one live pass" },
      { channel: "sms", effectiveness: 76, note: "Best for the doc-upload link and nudges" },
      { channel: "email", effectiveness: 63, note: "For sending forms and confirmations" },
    ],
    recommendation:
      "Capture the maximum number of fields on the first live call and send the document link before hanging up — every deferred field is a chance to stall.",
  },
  verification: {
    headline:
      "The stall zone — 23 sellers are stuck here, almost all on a fixable data mismatch.",
    narrative:
      "This is where verification actually happens, and where the agent earns its keep. Most stalls aren't lost interest — they're tax-ID or business-name mismatches between what the seller said and what their filing says, caught by document OCR before they fail review.",
    metrics: [
      { label: "In docs & verification", value: "134" },
      { label: "Currently stalled", value: "23", sub: "mostly mismatches" },
      { label: "Submitted after fix", value: "108", sub: "81% of stage" },
    ],
    dropoff: [
      { reason: "Tax ID / EIN mismatch", pct: 39 },
      { reason: "Business-name mismatch", pct: 26 },
      { reason: "Missing reseller certificate", pct: 22 },
      { reason: "Payout / banking setup", pct: 13 },
    ],
    channels: [
      { channel: "ocr", effectiveness: 95, note: "Catches mismatches before submission" },
      { channel: "sms", effectiveness: 81, note: "Proactive heads-up keeps sellers informed" },
      { channel: "voice", effectiveness: 78, note: "Resolves the correction in one call" },
    ],
    recommendation:
      "OCR every document the moment it arrives and reconcile it against what was said on the call. Flagging a mismatch here is far cheaper than a failed verification.",
  },
  submitted: {
    headline: "In Walmart review — the goal here is a clean first-pass approval.",
    narrative:
      "Applications here have been submitted and are awaiting approval. Drop-off is now about the quality of the package: details caught late and slow responses to clarification requests are the main risks.",
    metrics: [
      { label: "Submitted for approval", value: "108" },
      { label: "Approved", value: "95", sub: "88% of stage" },
      { label: "Avg. time in review", value: "1.4 days" },
    ],
    dropoff: [
      { reason: "Detail caught late in review", pct: 48 },
      { reason: "Seller non-responsive to clarification", pct: 31 },
      { reason: "Resubmission required", pct: 21 },
    ],
    channels: [
      { channel: "email", effectiveness: 80, note: "Status updates and clarification requests" },
      { channel: "voice", effectiveness: 77, note: "Fastest path to unblock a clarification" },
      { channel: "sms", effectiveness: 69, note: "Nudges for a pending reply" },
    ],
    recommendation:
      "Pre-validate the full record before submitting — the cheapest rejection is the one that never happens. Most remaining drop-off is preventable upstream.",
  },
  active: {
    headline: "The goal state — live on Walmart.com, with no further drop-off.",
    narrative:
      "Sellers here are fully verified and selling. Reaching this point took an average of 4.1 days versus a ~26-day baseline, and 61 of these sellers would have dropped off entirely without recovery.",
    metrics: [
      { label: "Active sellers", value: "95" },
      { label: "Recovered from stall", value: "61", sub: "would have dropped" },
      { label: "Avg. time to active", value: "4.1 days", sub: "from ~26" },
    ],
    dropoff: [],
    channels: [
      { channel: "voice", effectiveness: 86, note: "Context-aware inbound callbacks close the loop" },
      { channel: "email", effectiveness: 72, note: "Onboarding confirmations and next steps" },
      { channel: "sms", effectiveness: 68, note: "Go-live confirmations" },
    ],
    recommendation:
      "No recovery needed — monitor for catalog and listing setup as the next workflow.",
  },
};

/* ------------------------------------------------------------------ *
 * Sellers
 * ------------------------------------------------------------------ */

export const sellers: Seller[] = [
  {
    id: "summit-hearth",
    company: "Summit Hearth Goods",
    contact: "Dana Reyes",
    location: "Portland, OR",
    initials: "SH",
    avatarFrom: "#0071dc",
    avatarTo: "#004f9a",
    stage: "active",
    status: { label: "Approved", variant: "active" },
    lastTouch: { channel: "voice", label: "Inbound call · Day 5" },
    completeness: 100,
    recovery: {
      title: "Onboarded in 5 days",
      detail: "Would have dropped off at the tax-verification step on Day 0",
    },
    fieldsVerified: 12,
    fields: [
      {
        key: "Legal business name",
        value: "Summit Hearth Goods LLC",
        source: "ocr",
        note: "corrected",
      },
      { key: "EIN / Tax ID", value: "86-2672049", source: "ocr", mono: true },
      { key: "Entity type", value: "Single-member LLC", source: "voice" },
      {
        key: "US warehouse + returns",
        value: "Confirmed — Portland, OR",
        source: "voice",
      },
      { key: "Product GTIN / UPC", value: "GS1 prefix on file", source: "sms" },
      {
        key: "Business registration doc",
        value: "Certificate of Formation",
        source: "email",
      },
      {
        key: "Payment / payout method",
        value: "Marketplace Wallet linked",
        source: "voice",
      },
    ],
    timeline: [
      {
        kind: "portal",
        title: "Started application — abandoned",
        time: "Day 0",
        desc: "Entered name + phone, hit the EIN / business-verification step, and left. Account never created.",
      },
      {
        kind: "agent",
        title: "Agent activated",
        time: "Day 3",
        desc: "Detected an abandoned signup with only a phone number captured. Outbound recovery triggered.",
      },
      {
        kind: "call",
        title: "Cold-start recovery call",
        time: "Day 3",
        desc: "Reached Dana on the one number she'd entered. Collected entity type, warehouse, and product details conversationally.",
        quote: {
          text: "Perfect — I'll email you the couple of forms we still need. Just reply with them attached whenever you're ready.",
          agent: true,
        },
        tag: { text: "3 fields captured on call", tone: "good" },
      },
      {
        kind: "email",
        title: "Email sent — reply with document",
        time: "Day 4",
        desc: "Requested the business registration doc + 2 details. Dana replied with her Certificate of Formation attached.",
      },
      {
        kind: "ocr",
        title: "OCR caught a name discrepancy",
        time: "Day 4",
        desc: "Read the document and compared it to what Dana provided on the call.",
        discrepancy: {
          label: "Business name mismatch — form vs. filing",
          said: "Summit Hearth Co.",
          filing: "Summit Hearth Goods LLC",
        },
        tag: { text: "Flagged before it could fail verification", tone: "flag" },
        document: {
          kind: "Certificate of Formation",
          jurisdiction: "State of Oregon · Secretary of State",
          filedDate: "March 14, 2024",
          docId: "OR-LLC-2024-0419772",
          fields: [
            {
              label: "Legal business name",
              value: "Summit Hearth Goods LLC",
              confidence: 99.2,
              status: "conflict",
              conflictWith: "Summit Hearth Co.",
            },
            {
              label: "Entity type",
              value: "Limited Liability Company",
              confidence: 98.6,
              status: "match",
            },
            {
              label: "Jurisdiction",
              value: "State of Oregon",
              confidence: 99.5,
              status: "ok",
            },
            {
              label: "EIN / Tax ID",
              value: "86-2672049",
              confidence: 97.1,
              status: "match",
            },
            {
              label: "Registered agent",
              value: "Dana Reyes",
              confidence: 96.3,
              status: "match",
            },
            {
              label: "Date filed",
              value: "March 14, 2024",
              confidence: 95.8,
              status: "ok",
            },
          ],
        },
      },
      {
        kind: "sms",
        title: "Proactive heads-up sent",
        time: "Day 4",
        quote: {
          text: "Quick thing, Dana — the name on your filing is 'Summit Hearth Goods LLC,' which is what Walmart needs to match. Call anytime and I'll get it squared away.",
        },
      },
      {
        kind: "call",
        title: "Inbound callback — full context",
        time: "Day 5",
        desc: "Dana called the number back. Agent already had all 5 prior touchpoints — no re-explaining.",
        quote: {
          text: "Thanks for calling back — I've got your file right here. Let's lock in 'Summit Hearth Goods LLC' and submit you for approval.",
          agent: true,
        },
        tag: { text: "Name corrected · application submitted", tone: "good" },
      },
      {
        kind: "win",
        title: "Approved — active seller",
        time: "Day 5",
        desc: "Verification cleared on the first submission. Live on Walmart.com.",
      },
    ],
  },
  {
    id: "cedar-co-bath",
    company: "Cedar & Co. Bath",
    contact: "Marcus Hale",
    location: "Austin, TX",
    initials: "CB",
    avatarFrom: "#5e9ed2",
    avatarTo: "#4684bd",
    stage: "verification",
    status: { label: "Stalled 2d", variant: "stalled" },
    lastTouch: { channel: "email", label: "Email · 2d ago" },
    completeness: 70,
    recovery: {
      title: "Re-engaged after 9 days dark",
      detail: "Stalled on a missing reseller certificate — agent is chasing it now",
    },
    fieldsVerified: 7,
    fields: [
      {
        key: "Legal business name",
        value: "Cedar & Co. Bath LLC",
        source: "voice",
      },
      { key: "EIN / Tax ID", value: "47-5589210", source: "ocr", mono: true },
      { key: "Entity type", value: "Multi-member LLC", source: "voice" },
      { key: "US warehouse + returns", value: "Confirmed — Austin, TX", source: "voice" },
      {
        key: "Reseller certificate",
        value: "Requested — awaiting reply",
        source: "email",
        note: "pending",
      },
    ],
    timeline: [
      {
        kind: "portal",
        title: "Started application — abandoned",
        time: "Day 0",
        desc: "Stopped at the document-upload step. No documents submitted.",
      },
      {
        kind: "agent",
        title: "Agent activated",
        time: "Day 2",
        desc: "Detected a stalled signup and queued an outbound recovery sequence.",
      },
      {
        kind: "call",
        title: "Recovery call — qualified",
        time: "Day 2",
        desc: "Confirmed entity, warehouse and product category over the phone.",
        quote: {
          text: "Got it — last thing we need is your reseller certificate. I'll text and email you the upload link.",
          agent: true,
        },
        tag: { text: "4 fields captured on call", tone: "good" },
      },
      {
        kind: "email",
        title: "Document request sent",
        time: "Day 5",
        desc: "Reseller certificate requested with a one-tap upload link. No reply yet — follow-up scheduled.",
        tag: { text: "Awaiting reseller certificate", tone: "flag" },
      },
    ],
  },
  {
    id: "northwind-outdoor",
    company: "Northwind Outdoor",
    contact: "Priya Anand",
    location: "Denver, CO",
    initials: "NO",
    avatarFrom: "#7fb0d8",
    avatarTo: "#5d93c4",
    stage: "submitted",
    status: { label: "In review", variant: "progress" },
    lastTouch: { channel: "email", label: "Email · 1d ago" },
    completeness: 90,
    fieldsVerified: 11,
    fields: [
      { key: "Legal business name", value: "Northwind Outdoor Inc.", source: "ocr" },
      { key: "EIN / Tax ID", value: "82-1140398", source: "ocr", mono: true },
      { key: "Entity type", value: "C-Corporation", source: "voice" },
      { key: "US warehouse + returns", value: "Confirmed — Denver, CO", source: "voice" },
      { key: "Product GTIN / UPC", value: "GS1 prefix on file", source: "email" },
      { key: "Payment / payout method", value: "Marketplace Wallet linked", source: "voice" },
    ],
    timeline: [
      {
        kind: "agent",
        title: "Agent activated",
        time: "Day 1",
        desc: "Picked up an incomplete application and started outreach.",
      },
      {
        kind: "call",
        title: "Qualification call",
        time: "Day 1",
        desc: "Walked Priya through entity, fulfillment and catalog questions.",
        tag: { text: "5 fields captured on call", tone: "good" },
      },
      {
        kind: "email",
        title: "Docs received & verified",
        time: "Day 2",
        desc: "Articles of Incorporation and W-9 received; OCR matched the legal name on file.",
      },
      {
        kind: "win",
        title: "Submitted for approval",
        time: "Day 2",
        desc: "Clean package submitted. Currently in Walmart review.",
      },
    ],
  },
  {
    id: "brightline-pet",
    company: "Brightline Pet Supply",
    contact: "Tony Russo",
    location: "Tampa, FL",
    initials: "BP",
    avatarFrom: "#3f8fcf",
    avatarTo: "#2d77b8",
    stage: "qualified",
    status: { label: "Active outreach", variant: "progress" },
    lastTouch: { channel: "voice", label: "Voice · 4h ago" },
    completeness: 55,
    fieldsVerified: 6,
    fields: [
      { key: "Legal business name", value: "Brightline Pet Supply LLC", source: "voice" },
      { key: "Entity type", value: "Single-member LLC", source: "voice" },
      { key: "US warehouse + returns", value: "Confirmed — Tampa, FL", source: "voice" },
      { key: "EIN / Tax ID", value: "Requested on call", source: "voice", note: "pending" },
    ],
    timeline: [
      {
        kind: "agent",
        title: "Agent activated",
        time: "Day 0",
        desc: "New lead routed straight to outbound outreach.",
      },
      {
        kind: "call",
        title: "First contact — qualified",
        time: "4h ago",
        desc: "Reached Tony on the first try. Captured business basics and scheduled a doc upload.",
        quote: {
          text: "Sounds good — I'll send the link for your EIN letter and we'll keep moving.",
          agent: true,
        },
        tag: { text: "3 fields captured on call", tone: "good" },
      },
    ],
  },
  {
    id: "foundry-tools",
    company: "Foundry Tools Co.",
    contact: "Becca Lin",
    location: "Columbus, OH",
    initials: "FT",
    avatarFrom: "#15a34a",
    avatarTo: "#0e8a3d",
    stage: "active",
    status: { label: "Approved", variant: "active" },
    lastTouch: { channel: "email", label: "Email · 5d ago" },
    completeness: 100,
    recovery: {
      title: "Onboarded in 3 days",
      detail: "Self-serve abandonment recovered with a single call",
    },
    fieldsVerified: 12,
    fields: [
      { key: "Legal business name", value: "Foundry Tools Co.", source: "ocr" },
      { key: "EIN / Tax ID", value: "61-2299845", source: "ocr", mono: true },
      { key: "Entity type", value: "S-Corporation", source: "voice" },
      { key: "US warehouse + returns", value: "Confirmed — Columbus, OH", source: "voice" },
      { key: "Product GTIN / UPC", value: "GS1 prefix on file", source: "sms" },
      { key: "Payment / payout method", value: "Marketplace Wallet linked", source: "voice" },
    ],
    timeline: [
      {
        kind: "agent",
        title: "Agent activated",
        time: "Day 0",
        desc: "Recovered an abandoned application within the hour.",
      },
      {
        kind: "call",
        title: "Recovery call",
        time: "Day 0",
        desc: "Captured all qualifying details in one conversation.",
        tag: { text: "6 fields captured on call", tone: "good" },
      },
      {
        kind: "win",
        title: "Approved — active seller",
        time: "Day 3",
        desc: "Verification cleared on first submission. Live on Walmart.com.",
      },
    ],
  },
  {
    id: "maple-row",
    company: "Maple Row Goods",
    contact: "Owen Pratt",
    location: "Madison, WI",
    initials: "MR",
    avatarFrom: "#5e9ed2",
    avatarTo: "#4684bd",
    stage: "verification",
    status: { label: "Stalled 3d", variant: "stalled" },
    lastTouch: { channel: "voice", label: "Voice · 3d ago" },
    completeness: 65,
    recovery: {
      title: "EIN mismatch flagged early",
      detail: "OCR caught a Tax ID that doesn't match the IRS letter — agent resolving",
    },
    fieldsVerified: 6,
    fields: [
      { key: "Legal business name", value: "Maple Row Goods LLC", source: "voice" },
      {
        key: "EIN / Tax ID",
        value: "39-4471028",
        source: "ocr",
        mono: true,
        note: "needs review",
      },
      { key: "Entity type", value: "Single-member LLC", source: "voice" },
      { key: "US warehouse + returns", value: "Confirmed — Madison, WI", source: "voice" },
    ],
    timeline: [
      {
        kind: "agent",
        title: "Agent activated",
        time: "Day 0",
        desc: "Started recovery on an abandoned application.",
      },
      {
        kind: "call",
        title: "Recovery call — qualified",
        time: "Day 1",
        desc: "Captured business basics and requested the EIN letter.",
        tag: { text: "4 fields captured on call", tone: "good" },
      },
      {
        kind: "ocr",
        title: "OCR caught an EIN mismatch",
        time: "Day 3",
        desc: "The Tax ID on the uploaded letter doesn't match what was entered in the portal.",
        discrepancy: {
          label: "Tax ID mismatch — portal vs. IRS letter",
          said: "39-4471082",
          filing: "39-4471028",
        },
        tag: { text: "Flagged before it could fail verification", tone: "flag" },
      },
    ],
  },
  {
    id: "vela-kitchenware",
    company: "Vela Kitchenware",
    contact: "Sofia Cruz",
    location: "Phoenix, AZ",
    initials: "VK",
    avatarFrom: "#94a3b8",
    avatarTo: "#64748b",
    stage: "outreach",
    status: { label: "New lead", variant: "new" },
    lastTouch: { channel: "sms", label: "SMS · 6h ago" },
    completeness: 25,
    fieldsVerified: 2,
    fields: [
      { key: "Contact name", value: "Sofia Cruz", source: "sms" },
      { key: "Phone", value: "Captured at signup", source: "sms" },
    ],
    timeline: [
      {
        kind: "portal",
        title: "Started application — abandoned",
        time: "Day 0",
        desc: "Entered contact details, then left before the business-info step.",
      },
      {
        kind: "agent",
        title: "Agent activated",
        time: "6h ago",
        desc: "Opened with an SMS to confirm a good time to talk. Awaiting reply.",
        quote: {
          text: "Hi Sofia — this is the Walmart Marketplace team. Got a couple minutes to finish your seller setup? Reply here or I can call.",
        },
      },
    ],
  },
];
