//-----------------------------------------------------------------------
// Claim notes — data access against the Rayfin-managed database (DAB/MSSQL).
//
// The notes are stored server-side via the `ClaimNote` entity defined in
// `rayfin/data/claim-note.ts`, so they are shared across every user of the app.
// All calls go through the authenticated RayfinClient; the app establishes a
// Fabric SSO session on boot (see AuthProvider / initEmbeddedAuth), so the
// bearer token is attached automatically.
//-----------------------------------------------------------------------

import type { RayfinClient } from "@microsoft/rayfin-client";
import { getRayfinClient } from "@/lib/rayfin-client";

/** Row shape of a persisted claim note (mirrors the `ClaimNote` entity). */
export interface ClaimNoteRow {
    id: string;
    claim_id: number;
    body: string;
    author: string;
    author_id: string;
    created_at: string;
}

type NotesSchema = { ClaimNote: ClaimNoteRow };

const NOTE_FIELDS = [
    "id",
    "claim_id",
    "body",
    "author",
    "author_id",
    "created_at",
] as const;

function notesClient(): RayfinClient<NotesSchema> {
    return getRayfinClient() as unknown as RayfinClient<NotesSchema>;
}

/** All notes for a claim, newest first. */
export async function listClaimNotes(claimId: number): Promise<ClaimNoteRow[]> {
    return notesClient()
        .data.ClaimNote.select(NOTE_FIELDS)
        .where({ claim_id: { eq: claimId } })
        .orderBy({ created_at: "desc" })
        .execute();
}

export interface NewClaimNote {
    claimId: number;
    body: string;
    author: string;
    authorId: string;
}

/** Persist a new note and return the stored row. */
export async function addClaimNote(input: NewClaimNote): Promise<ClaimNoteRow> {
    return notesClient().data.ClaimNote.create({
        id: crypto.randomUUID(),
        claim_id: input.claimId,
        body: input.body,
        author: input.author,
        author_id: input.authorId,
        created_at: new Date().toISOString(),
    });
}
