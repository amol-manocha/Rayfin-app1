//-----------------------------------------------------------------------
// Communications — a Work IQ–powered feed of the emails and Teams
// messages that mention this customer or one of their claim numbers.
// Each item links straight to the relevant Claim 360 when it references
// a claim, so an adjuster can jump from a conversation to the record.
//
// NOTE: this app authenticates with a Fabric-brokered Rayfin session and
// has no Microsoft Graph / Work IQ token wired up, so the feed below is
// deterministically *simulated* from the customer id and their real claim
// numbers (stable per customer) purely for demonstration. Swap
// `buildCommunications` for a Microsoft Graph search (`/search/query` over
// `message` + `chatMessage` entity types) once Graph scopes are granted —
// the rendering layer already expects this shape. A disclaimer is rendered
// at the bottom of the card.
//-----------------------------------------------------------------------

import { Mail, MessagesSquare, Sparkles, Paperclip } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/card";
import { ClaimLink } from "@/components/entity-link";

export interface CustomerClaimRef {
    id: number;
    type: string;
    status: string;
}

type Channel = "email" | "teams";

interface CommItem {
    key: string;
    channel: Channel;
    subject: string;
    snippet: string;
    from: string;
    fromRole: string;
    minutesAgo: number;
    claimId: number | null;
    unread: boolean;
    hasAttachment: boolean;
}

// --- deterministic seeded RNG (FNV-1a hash + mulberry32) ---------------
function hashSeed(input: string): number {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const SENDERS: { name: string; role: string }[] = [
    { name: "Dana Whitfield", role: "Claims Adjuster" },
    { name: "Marcus Bell", role: "Senior Adjuster" },
    { name: "Priya Nair", role: "Underwriting" },
    { name: "Owen Castillo", role: "Body Shop — Apex Auto" },
    { name: "Lena Fischer", role: "SIU / Fraud Review" },
    { name: "Tomás Rivera", role: "Customer Care" },
    { name: "Grace Sullivan", role: "Subrogation" },
];

// Templates referencing a specific claim number.
const CLAIM_EMAILS: ((firstName: string, claimId: number) => { subject: string; snippet: string })[] = [
    (f, c) => ({
        subject: `Re: Claim ${c} — repair estimate approved`,
        snippet: `Hi, the estimate for ${f}'s vehicle came back within coverage. I've approved it and notified the shop. Let me know if you need the breakdown.`,
    }),
    (f, c) => ({
        subject: `Documents needed for Claim ${c}`,
        snippet: `We're still missing the signed release and the second set of damage photos from ${f}. Can you nudge them before we close out the file?`,
    }),
    (f, c) => ({
        subject: `Settlement update — Claim ${c}`,
        snippet: `Payment was issued today. ${f} should see funds within 2–3 business days. I'll mark the claim closed once it clears.`,
    }),
    (_f, c) => ({
        subject: `Photos received for Claim ${c}`,
        snippet: `Got the inspection photos back from the field. Front-end damage is consistent with the report — forwarding to the estimator now.`,
    }),
];

const CLAIM_TEAMS: ((firstName: string, claimId: number) => string)[] = [
    (f, c) => `Quick one — can you confirm the deductible on claim ${c} for ${f}? They asked on the call.`,
    (f, c) => `Heads up: ${f} just called about claim ${c}, wants an ETA on the rental authorization.`,
    (_f, c) => `Approved the supplemental on claim ${c} — shop found hidden frame damage. Updated the reserve.`,
    (f, c) => `${f}'s adjuster is OOO this week; I'm covering claim ${c} if anything urgent comes in.`,
];

// Templates that mention the customer generally (no specific claim).
const GENERAL_EMAILS: ((firstName: string, fullName: string) => { subject: string; snippet: string })[] = [
    (_f, n) => ({
        subject: `Welcome packet sent to ${n}`,
        snippet: `Policy docs and the claims-portal invite went out this morning. Flagging in case they reply with onboarding questions.`,
    }),
    (f) => ({
        subject: `${f} updated their contact details`,
        snippet: `New mailing address and phone on file. I've synced it to the policy record — no action needed, just keeping everyone in the loop.`,
    }),
];

const GENERAL_TEAMS: ((firstName: string) => string)[] = [
    (f) => `${f} is a multi-policy holder — looping in retention before we discuss any premium changes.`,
    (f) => `FYI ${f} left a 5-star note after their last claim experience. Nice work, team. 🎉`,
];

function buildCommunications(
    customerId: string,
    customerName: string,
    claims: CustomerClaimRef[],
): CommItem[] {
    const rand = mulberry32(hashSeed(`comms:${customerId}`));
    const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
    const firstName = (customerName || "the customer").split(" ")[0] || "the customer";

    const count = 5 + Math.floor(rand() * 3); // 5–7 items
    const items: CommItem[] = [];
    let cursor = 25 + Math.floor(rand() * 90); // minutes ago for the most recent

    for (let i = 0; i < count; i++) {
        const sender = pick(SENDERS);
        const channel: Channel = rand() < 0.5 ? "email" : "teams";
        // ~70% of messages reference a real claim when the customer has any.
        const useClaim = claims.length > 0 && rand() < 0.7;
        const claim = useClaim ? pick(claims) : null;

        let subject: string;
        let snippet: string;
        if (channel === "email") {
            if (claim) {
                const t = pick(CLAIM_EMAILS)(firstName, claim.id);
                subject = t.subject;
                snippet = t.snippet;
            } else {
                const t = pick(GENERAL_EMAILS)(firstName, customerName);
                subject = t.subject;
                snippet = t.snippet;
            }
        } else {
            subject = claim ? `Teams · Claims channel` : `Teams · Book of business`;
            snippet = claim
                ? pick(CLAIM_TEAMS)(firstName, claim.id)
                : pick(GENERAL_TEAMS)(firstName);
        }

        items.push({
            key: `comm-${i}`,
            channel,
            subject,
            snippet,
            from: sender.name,
            fromRole: sender.role,
            minutesAgo: cursor,
            claimId: claim?.id ?? null,
            unread: i < 2 && rand() < 0.7,
            hasAttachment: channel === "email" && rand() < 0.4,
        });

        // Walk further back in time for each subsequent (older) item.
        cursor += 90 + Math.floor(rand() * 60 * 28); // up to ~28h jumps
    }

    return items;
}

function relativeTime(minutesAgo: number): string {
    if (minutesAgo < 2) return "Just now";
    if (minutesAgo < 60) return `${minutesAgo}m`;
    const hours = Math.round(minutesAgo / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.round(hours / 24);
    if (days < 7) return `${days}d`;
    return `${Math.round(days / 7)}w`;
}

const CHANNEL_META: Record<
    Channel,
    { label: string; Icon: typeof Mail; accent: string; bubble: string }
> = {
    email: {
        label: "Email",
        Icon: Mail,
        accent: "var(--color-status-review)",
        bubble: "var(--color-status-review-soft)",
    },
    teams: {
        label: "Teams",
        Icon: MessagesSquare,
        accent: "var(--color-primary)",
        bubble: "var(--color-accent)",
    },
};

function CommRow({ item }: { item: CommItem }) {
    const meta = CHANNEL_META[item.channel];
    const { Icon } = meta;
    return (
        <li className="flex gap-s px-l py-m">
            <span
                className="mt-xxs flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: meta.bubble, color: meta.accent }}
                aria-hidden
            >
                <Icon className="icon-size-150" />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-xxs">
                <div className="flex items-start justify-between gap-s">
                    <div className="flex min-w-0 items-center gap-xs">
                        {item.unread ? (
                            <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ background: meta.accent }}
                                aria-label="Unread"
                            />
                        ) : null}
                        <h4
                            className={
                                "truncate text-[length:var(--text-200)] text-foreground " +
                                (item.unread ? "font-semibold" : "font-medium")
                            }
                        >
                            {item.subject}
                        </h4>
                    </div>
                    <span className="shrink-0 text-[length:var(--text-100)] text-muted-foreground">
                        {relativeTime(item.minutesAgo)}
                    </span>
                </div>

                <p className="line-clamp-2 text-[length:var(--text-200)] leading-200 text-muted-foreground">
                    {item.snippet}
                </p>

                <div className="flex flex-wrap items-center gap-x-s gap-y-xxs text-[length:var(--text-100)] text-muted-foreground">
                    <span className="font-medium text-foreground">{item.from}</span>
                    <span aria-hidden>·</span>
                    <span>{item.fromRole}</span>
                    {item.hasAttachment ? (
                        <Paperclip className="icon-size-100" aria-label="Has attachment" />
                    ) : null}
                    {item.claimId != null ? (
                        <>
                            <span aria-hidden>·</span>
                            <ClaimLink id={item.claimId}>Claim {item.claimId}</ClaimLink>
                        </>
                    ) : null}
                </div>
            </div>
        </li>
    );
}

export function CommunicationsCard({
    customerId,
    customerName,
    claims,
    className,
}: {
    customerId: string;
    customerName: string;
    claims: CustomerClaimRef[];
    className?: string;
}) {
    const items = buildCommunications(customerId, customerName, claims);
    const unreadCount = items.filter((i) => i.unread).length;
    const firstName = (customerName || "this customer").split(" ")[0] || "this customer";

    return (
        <Card className={className}>
            <CardHeader
                title="Communications"
                subtitle="Emails & Teams about this customer"
                action={
                    <span className="inline-flex items-center gap-xs rounded-full bg-accent px-s py-xxs text-[length:var(--text-100)] font-semibold text-accent-foreground">
                        <Sparkles className="icon-size-100" aria-hidden />
                        Work IQ
                    </span>
                }
            />
            <CardContent className="gap-s p-0">
                <p className="px-l text-[length:var(--text-200)] text-muted-foreground">
                    <span className="font-semibold text-foreground">{items.length}</span>{" "}
                    messages mentioning {firstName} or their claims
                    {unreadCount > 0 ? (
                        <>
                            {" · "}
                            <span className="font-semibold text-foreground">
                                {unreadCount}
                            </span>{" "}
                            unread
                        </>
                    ) : null}
                </p>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <ul className="flex flex-col divide-y divide-border">
                        {items.map((item) => (
                            <CommRow key={item.key} item={item} />
                        ))}
                    </ul>
                </div>

                <p className="border-t border-border px-l py-s text-center text-[length:var(--text-100)] italic leading-100 text-muted-foreground">
                    Illustrative data — surfaced via Work IQ from your mailbox and Teams.
                    Messages are simulated for demonstration and are not sourced from the
                    claims model.
                </p>
            </CardContent>
        </Card>
    );
}
