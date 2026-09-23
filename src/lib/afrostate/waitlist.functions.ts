import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setCookie, useSession } from "@tanstack/react-start/server";
import { z } from "zod";

const waitlistSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phoneNumber: z.string().trim().max(20),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  likedDesignId: z.string().trim().max(32).optional().or(z.literal("")),
});

const adminCodeSchema = z.object({ code: z.string().min(1).max(200) });
const sessionConfig = {
  password: process.env['ADMIN_SESSION_SECRET']!,
  name: "afrostate-admin",
  maxAge: 60 * 60 * 8,
  cookie: { httpOnly: true, secure: true, sameSite: "none" as const, path: "/", partitioned: true },
};
type AdminSession = { unlocked?: boolean };

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

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig);
  if (!session.data.unlocked && !hasValidAdminToken(requestAdminToken())) throw redirect({ to: "/admin" });
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator((input) => waitlistSchema.parse(input))
  .handler(async ({ data }) => {
    const phone = normalizeNigerianPhone(data.phoneNumber);
    if (!phone) return { status: "invalid_phone" as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("waiting_list").insert({
      full_name: data.fullName,
      phone_number: phone,
      email: data.email || null,
    });
    if (error?.code === "23505") return { status: "duplicate" as const };
    if (error) throw new Error("Unable to join the waitlist right now");
    return { status: "success" as const };
  });

export const unlockAdmin = createServerFn({ method: "POST" })
  .validator((input) => adminCodeSchema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env['AFROSTATE_ADMIN_CODE'];
    if (!expected || !safeMatch(data.code, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig);
    await session.update({ unlocked: true });
    const token = signAdminToken();
    setCookie("afrostate-admin-fallback", token, sessionConfig.cookie);
    return { ok: true as const, token };
  });

export const getAdminState = createServerFn({ method: "POST" })
  .validator((input) => z.object({ token: adminTokenSchema.optional() }).parse(input))
  .handler(async ({ data: requestData }) => {
  const session = await useSession<AdminSession>(sessionConfig);
  if (!session.data.unlocked && !hasValidAdminToken(requestData.token) && !hasValidAdminToken(requestAdminToken())) {
    return { unlocked: false as const, records: [] };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: records, error } = await supabaseAdmin
    .from("waiting_list")
    .select("id, full_name, phone_number, email, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load the waiting list");
  return { unlocked: true as const, records };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const session = await useSession<AdminSession>(sessionConfig);
  await session.clear();
  return { ok: true as const };
});