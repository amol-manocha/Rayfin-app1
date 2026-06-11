import { entity, authenticated, uuid, int, text, date } from "@microsoft/rayfin-core";

/**
 * A free-text note an investigator adds to a specific claim.
 *
 * Persisted in the Rayfin-managed database (Data API Builder / MSSQL) so notes
 * are shared across everyone who opens the app — not stored per-browser.
 *
 * Anonymous data access is not supported on Fabric, so the entity is gated to
 * the `authenticated` role. The app already establishes a Fabric SSO session on
 * boot (see `initEmbeddedAuth`), so every reader/writer is a known user; the
 * `author` / `author_id` fields capture who wrote each note.
 */
@entity()
@authenticated(["read", "create"])
export class ClaimNote {
    @uuid() id!: string;
    /** The claim this note belongs to (claims_fact[Claim_ID]). */
    @int() claim_id!: number;
    /** The note text. */
    @text({ max: 4000 }) body!: string;
    /** Display identity of the author (the signed-in user's email). */
    @text({ max: 256 }) author!: string;
    /** Stable user id of the author (session user id / claims.sub). */
    @text({ max: 128 }) author_id!: string;
    /** Timestamp the note was created. */
    @date() created_at!: Date;
}
