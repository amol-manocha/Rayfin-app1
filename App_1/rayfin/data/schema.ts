import { ClaimNote } from "./claim-note.js";

export { ClaimNote };

/**
 * The app's data schema, used to type the RayfinClient so `client.data.ClaimNote`
 * gets fully-typed `select` / `where` / `orderBy` / `create` calls.
 */
export type AppSchema = {
    ClaimNote: ClaimNote;
};
