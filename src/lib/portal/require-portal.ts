import { NextResponse } from "next/server";
import { resolvePortalByToken, PortalAccessResult } from "./resolve-portal";

const STATUS_BY_ACCESS: Record<Exclude<PortalAccessResult, "ok">, number> = {
  invalid: 404,
  disabled: 403,
  expired: 410,
};

// Shared guard for every /api/portal/[token]/* route — the token IS the auth,
// so every handler must re-validate it server-side rather than trusting the URL.
export async function requirePortal(token: string) {
  const { invitation, access } = await resolvePortalByToken(token);
  if (access !== "ok" || !invitation) {
    return { invitation: null, error: NextResponse.json({ error: access }, { status: STATUS_BY_ACCESS[access as Exclude<PortalAccessResult, "ok">] ?? 404 }) };
  }
  return { invitation, error: null as null };
}
