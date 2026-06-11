//-----------------------------------------------------------------------
// useClaimNotes — loads and appends investigator notes for a single claim.
//
// Notes persist server-side (Rayfin DAB). The author of each note is the
// signed-in Fabric user (from the auth session), so every note is attributed.
//-----------------------------------------------------------------------

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/auth.context";
import {
    addClaimNote,
    listClaimNotes,
    type ClaimNoteRow,
} from "@/lib/claim-notes";

function asError(err: unknown): Error {
    return err instanceof Error ? err : new Error(String(err));
}

export interface UseClaimNotes {
    notes: ClaimNoteRow[];
    isLoading: boolean;
    isSaving: boolean;
    error: Error | null;
    /** Display name of the user who will author new notes. */
    authorName: string;
    /** Append a note. Resolves once persisted; rejects on failure. */
    addNote: (body: string) => Promise<void>;
    reload: () => Promise<void>;
}

export function useClaimNotes(claimId: number): UseClaimNotes {
    const { session } = useAuth();
    const authorName = session?.user?.email ?? "Unknown user";
    const authorId = session?.user?.id ?? "";

    const [notes, setNotes] = useState<ClaimNoteRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const reload = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            setNotes(await listClaimNotes(claimId));
        } catch (err) {
            setError(asError(err));
        } finally {
            setIsLoading(false);
        }
    }, [claimId]);

    useEffect(() => {
        void reload();
    }, [reload]);

    const addNote = useCallback(
        async (body: string) => {
            const text = body.trim();
            if (!text) return;

            setIsSaving(true);
            setError(null);
            try {
                const created = await addClaimNote({
                    claimId,
                    body: text,
                    author: authorName,
                    authorId,
                });
                // Prepend so the newest note appears first. Fall back to a
                // locally-shaped row if the API echoes a partial object.
                const row: ClaimNoteRow = {
                    id: created?.id ?? crypto.randomUUID(),
                    claim_id: created?.claim_id ?? claimId,
                    body: created?.body ?? text,
                    author: created?.author ?? authorName,
                    author_id: created?.author_id ?? authorId,
                    created_at: created?.created_at ?? new Date().toISOString(),
                };
                setNotes((prev) => [row, ...prev]);
            } catch (err) {
                const e = asError(err);
                setError(e);
                throw e;
            } finally {
                setIsSaving(false);
            }
        },
        [claimId, authorName, authorId],
    );

    return { notes, isLoading, isSaving, error, authorName, addNote, reload };
}
