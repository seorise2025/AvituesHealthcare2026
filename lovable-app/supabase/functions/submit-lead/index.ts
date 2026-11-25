// Entry point for the submit-lead edge function. The logic is in lead.ts.
// Secrets it reads are listed at the top of lead.ts.
import { handler } from "./lead.ts";

Deno.serve(handler);
