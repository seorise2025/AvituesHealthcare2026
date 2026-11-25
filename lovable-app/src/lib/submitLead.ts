/**
 * Sends a form to whichever backend is configured.
 *
 *  1. VITE_LEAD_ENDPOINT          the Python lead handler in ../server (form-encoded POST)
 *  2. VITE_SUPABASE_URL + key     the "submit-lead" edge function (Lovable Cloud / Supabase)
 *
 * Nothing is stored in the visitor's browser.
 */
export type LeadType = "employer" | "candidate" | "general";
export type SubmitResult =
  | { kind: "ok"; ref: string }
  | { kind: "invalid"; errors: Record<string, string> }
  | { kind: "failed" };

const REF = /AV-\d{8}-[A-Z0-9]{5}/;

export function backendConfigured(): boolean {
  const env = import.meta.env;
  return Boolean(env.VITE_LEAD_ENDPOINT || (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY));
}

async function readJson(r: Response): Promise<Record<string, unknown>> {
  try {
    return (await r.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function toResult(status: number, data: Record<string, unknown>): SubmitResult {
  if (status === 200 && data.ok) {
    const ref = String(data.ref || "") || (String(data.redirect || "").match(REF)?.[0] ?? "");
    return { kind: "ok", ref };
  }
  if (status === 400 && data.errors && typeof data.errors === "object") {
    return { kind: "invalid", errors: data.errors as Record<string, string> };
  }
  return { kind: "failed" };
}

export async function submitLead(type: LeadType, body: URLSearchParams): Promise<SubmitResult> {
  const env = import.meta.env;
  body.set("lead_type", type);
  if (env.MODE === "clientpreview") {
    // Preview copy: nothing is sent anywhere. Show the thank-you page only.
    await new Promise((r) => setTimeout(r, 400));
    return { kind: "ok", ref: "" };
  }
  try {
    if (env.VITE_LEAD_ENDPOINT) {
      const r = await fetch(env.VITE_LEAD_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        credentials: "omit",
      });
      return toResult(r.status, await readJson(r));
    }
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY) {
      const fields: Record<string, string | string[]> = {};
      body.forEach((value, key) => {
        if (key === "roles") fields.roles = [...((fields.roles as string[]) || []), value];
        else fields[key] = value;
      });
      const r = await fetch(`${env.VITE_SUPABASE_URL}/functions/v1/submit-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(fields),
      });
      return toResult(r.status, await readJson(r));
    }
    console.warn("No form backend is set. See .env.example.");
    return { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}
