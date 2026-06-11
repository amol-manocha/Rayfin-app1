//-----------------------------------------------------------------------
// ClaimNotesPanel — add and read shared investigator notes on a claim.
//
// Notes are persisted server-side (Rayfin DAB) and attributed to the signed-in
// Fabric user, so the author's identity shows next to every note.
//-----------------------------------------------------------------------

import { useState, type KeyboardEvent } from "react";
import { MessageSquarePlus, AlertTriangle, Send } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/card";
import { useClaimNotes } from "@/hooks/use-claim-notes";
import { cn } from "@/lib/utils";

/** Format an ISO timestamp as a friendly, locale-aware date + time. */
function formatTimestamp(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

/** Two-letter initials from an email/display name for the avatar bubble. */
function initials(identity: string): string {
    const local = identity.split("@")[0] ?? identity;
    const parts = local.split(/[.\-_\s]+/).filter(Boolean);
    const letters =
        parts.length >= 2
            ? parts[0][0] + parts[1][0]
            : local.slice(0, 2);
    return letters.toUpperCase();
}

export function ClaimNotesPanel({ claimId }: { claimId: number }) {
    const { notes, isLoading, isSaving, error, authorName, addNote } =
        useClaimNotes(claimId);
    const [draft, setDraft] = useState("");

    const canSave = draft.trim().length > 0 && !isSaving;

    async function handleSave() {
        if (!canSave) return;
        try {
            await addNote(draft);
            setDraft("");
        } catch {
            // error is surfaced via the hook's `error` state
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            void handleSave();
        }
    }

    return (
        <Card>
            <CardHeader
                title={
                    <span className="inline-flex items-center gap-xs">
                        <MessageSquarePlus className="icon-size-200" aria-hidden />
                        Notes
                    </span>
                }
                subtitle="Shared notes on this claim — visible to everyone in the workspace"
            />
            <CardContent className="gap-l">
                {/* Composer */}
                <div className="flex flex-col gap-s rounded-xl border border-border bg-muted/40 p-m">
                    <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a note about this claim…"
                        rows={3}
                        className="w-full resize-y rounded-lg border border-border bg-card px-s py-s text-[length:var(--text-300)] text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                    <div className="flex items-center justify-between gap-m">
                        <p className="min-w-0 truncate text-[length:var(--text-200)] text-muted-foreground">
                            Posting as{" "}
                            <span className="font-medium text-foreground">
                                {authorName}
                            </span>
                        </p>
                        <button
                            type="button"
                            onClick={() => void handleSave()}
                            disabled={!canSave}
                            className={cn(
                                "inline-flex shrink-0 items-center gap-xs rounded-lg bg-foreground px-m py-xs text-[length:var(--text-300)] font-medium text-background transition-opacity",
                                "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                                "disabled:cursor-not-allowed disabled:opacity-40",
                            )}
                        >
                            <Send className="icon-size-100" aria-hidden />
                            {isSaving ? "Saving…" : "Save note"}
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="flex items-start gap-xs rounded-lg border border-destructive/40 bg-destructive/10 px-s py-s text-[length:var(--text-200)] text-destructive">
                        <AlertTriangle
                            className="icon-size-100 mt-xxs shrink-0"
                            aria-hidden
                        />
                        <span className="break-words">
                            Couldn't save or load notes. {error.message}
                        </span>
                    </div>
                ) : null}

                {/* Notes list */}
                {isLoading ? (
                    <p className="text-[length:var(--text-300)] text-muted-foreground">
                        Loading notes…
                    </p>
                ) : notes.length === 0 ? (
                    <p className="text-[length:var(--text-300)] text-muted-foreground">
                        No notes yet — add the first one.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-m">
                        {notes.map((note) => (
                            <li
                                key={note.id}
                                className="flex gap-s rounded-xl border border-border bg-card p-m"
                            >
                                <div
                                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[length:var(--text-200)] font-semibold text-brand-foreground"
                                    aria-hidden
                                >
                                    {initials(note.author)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-m gap-y-xxs">
                                        <span className="truncate text-[length:var(--text-300)] font-semibold text-foreground">
                                            {note.author}
                                        </span>
                                        <span className="shrink-0 text-[length:var(--text-200)] text-muted-foreground">
                                            {formatTimestamp(note.created_at)}
                                        </span>
                                    </div>
                                    <p className="mt-xxs whitespace-pre-wrap break-words text-[length:var(--text-300)] text-card-foreground">
                                        {note.body}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
