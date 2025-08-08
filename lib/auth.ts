// Placeholder for auth (email magic link or Supabase).
// For MVP, we mock a user via cookie in API routes if no auth is wired.
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const cookie = cookies().get("user-email")?.value;
  if (!cookie) return null;
  return prisma.user.findUnique({ where: { email: cookie } });
}
