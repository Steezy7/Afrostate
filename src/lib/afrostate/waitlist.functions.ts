import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

const waitlistSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phoneNumber: z.string().trim().max(20),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
});

const adminCodeSchema = z.object({ code: z.string().min(1).max(200) });
const sessionConfig = {
  password: process.env['ADMIN_SESSION_SECRET']!,
  name: "afrostate-admin",
  maxAge: 60 * 60 * 8,
  cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
};
type AdminSession = { unlocked?: boolean };

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
  if (!session.data.unlocked) throw redirect({ to: "/admin" });
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input) => waitlistSchema.parse(input))
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
  .inputValidator((input) => adminCodeSchema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env['AFROSTATE_ADMIN_CODE'];
    if (!expected || !safeMatch(data.code, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig);
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const getAdminState = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig);
  if (!session.data.unlocked) return { unlocked: false as const, records: [] };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("waiting_list")
    .select("id, full_name, phone_number, email, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load the waiting list");
  return { unlocked: true as const, records: data };
});

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const session = await useSession<AdminSession>(sessionConfig);
  await session.clear();
  return { ok: true as const };
});