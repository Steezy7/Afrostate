import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const waitlistSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phoneNumber: z.string().trim().max(20),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  likedDesignId: z.string().trim().max(32).optional().or(z.literal("")),
});

const adminCodeSchema = z.object({ code: z.string().min(1).max(200) });
const adminTokenSchema = z.string().min(32).max(500);

function signAdminToken() {
  const secret = process.env['ADMIN_SESSION_SECRET']!;
  const expiresAt = Date.now() + sessionConfig.maxAge * 1000;
  const payload = String(expiresAt);
  const signature = createHash("sha256").update(`${payload}:${secret}`).digest("hex");
  return `${payload}.${signature}`;
}

function hasValidAdminToken(token?: string) {
  if (!token) return false;
  const [payload, signature, ...rest] = token.split(".");
  if (!payload || !signature || rest.length || !/^\d+$/.test(payload) || Number(payload) <= Date.now()) return false;
  const secret = process.env['ADMIN_SESSION_SECRET']!;
  const expected = createHash("sha256").update(`${payload}:${secret}`).digest("hex");
  return safeMatch(signature, expected);
}

function requestAdminToken() {
  return getRequestHeader("x-afrostate-admin-token") ?? undefined;
}

function requestCookieToken() {
  const cookies = getRequestHeader("cookie") ?? "";
  const match = cookies.match(/(?:^|;\s*)afrostate-admin-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function normalizeNigerianPhone(input: string) {
  const compact = input.replace(/[\s()-]/g, "");
  if (/^0[789][01]\d{8}$/.test(compact)) return `+234${compact.slice(1)}`;
  if (/^234[789][01]\d{8}$/.test(compact)) return `+${compact}`;
  if (/^\+234[789][01]\d{8}$/.test(compact)) return compact;
  return null;
}

function safeMatch(input: string, expected: string) {
  const left = createHash("sha256").update(input).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

function requireAdmin(token?: string) {
  if (!hasValidAdminToken(token ?? requestAdminToken())) throw redirect({ to: "/admin" });
}

async function loadAdminState() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: rows, error }, { data: likes, error: likesError }] = await Promise.all([
    supabaseAdmin
      .from("waiting_list")
      .select("id, full_name, phone_number, email, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("design_likes").select("design_id, waiting_list_id"),
  ]);
  if (error) throw new Error(`Waitlist query failed: ${error.message}`);
  if (likesError) throw new Error(`Likes query failed: ${likesError.message}`);

  const byPerson = new Map<string, string[]>();
  const byDesign = new Map<string, number>();
  for (const like of likes ?? []) {
    byPerson.set(like.waiting_list_id, [...(byPerson.get(like.waiting_list_id) ?? []), like.design_id]);
    byDesign.set(like.design_id, (byDesign.get(like.design_id) ?? 0) + 1);
  }
  const records = (rows ?? []).map((row) => ({ ...row, likes: (byPerson.get(row.id) ?? []).sort() }));
  const likeTotals = [...byDesign.entries()]
    .map(([designId, count]) => ({ designId, count }))
    .sort((a, b) => b.count - a.count);
  return { unlocked: true as const, records, likeTotals };
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator((input) => waitlistSchema.parse(input))
  .handler(async ({ data }) => {
    const phone = normalizeNigerianPhone(data.phoneNumber);
    if (!phone) return { status: "invalid_phone" as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inserted, error } = await supabaseAdmin
      .from("waiting_list")
      .insert({ full_name: data.fullName, phone_number: phone, email: data.email || null })
      .select("id")
      .maybeSingle();
    const duplicate = error?.code === "23505";
    if (error && !duplicate) throw new Error("Unable to join the waitlist right now");

    let personId = inserted?.id ?? null;
    if (duplicate) {
      const { data: existing } = await supabaseAdmin
        .from("waiting_list")
        .select("id")
        .eq("phone_number", phone)
        .maybeSingle();
      personId = existing?.id ?? null;
    }
    if (personId && data.likedDesignId) {
      await supabaseAdmin
        .from("design_likes")
        .upsert({ design_id: data.likedDesignId, waiting_list_id: personId }, { onConflict: "design_id,waiting_list_id" });
    }
    return { status: duplicate ? ("duplicate" as const) : ("success" as const) };
  });

export const getDesignLikeCounts = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(process.env['SUPABASE_URL']!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  const { data, error } = await client.rpc("get_design_like_counts");
  if (error) return {} as Record<string, number>;
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { design_id: string; like_count: number }[]) {
    counts[row.design_id] = Number(row.like_count);
  }
  return counts;
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .validator((input) => adminCodeSchema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env['AFROSTATE_ADMIN_CODE'];
    if (!expected || !safeMatch(data.code, expected)) return { ok: false as const, reason: "invalid_code" as const };
    const token = signAdminToken();
    setCookie("afrostate-admin-token", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
    try {
      return { ok: true as const, token, state: await loadAdminState() };
    } catch (error) {
      return { ok: false as const, reason: error instanceof Error ? error.message : "Unable to load the dashboard data" };
    }
  });

export const getAdminState = createServerFn({ method: "POST" })
  .validator((input) => z.object({ token: adminTokenSchema.optional() }).parse(input))
  .handler(async ({ data: requestData }) => {
  if (!hasValidAdminToken(requestData.token) && !hasValidAdminToken(requestAdminToken()) && !hasValidAdminToken(requestCookieToken())) {
    return { unlocked: false as const, records: [], likeTotals: [] };
  }
  return loadAdminState();
  });

export const lockAdmin = createServerFn({ method: "POST" })
  .validator((input) => z.object({ token: adminTokenSchema.optional() }).parse(input))
  .handler(async ({ data }) => {
  requireAdmin(data.token ?? requestCookieToken());
  setCookie("afrostate-admin-token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return { ok: true as const };
});