import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_TOKEN } from "@/lib/session";
import { DEMO_CREDENTIALS } from "@/lib/auth-public";

/**
 * Demo authentication. This is intentionally lightweight — a single set of
 * shared pilot credentials gated by an httpOnly session cookie. It is NOT
 * production auth (no per-user accounts, hashing, or rotating secrets); swap in
 * a real identity provider before this leaves the pilot.
 */
export { SESSION_COOKIE, DEMO_CREDENTIALS };

export function createSessionValue() {
  return SESSION_TOKEN;
}

export function verifyCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  );
}

export async function isAuthenticated() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === SESSION_TOKEN;
}

/** The signed-in operator, or null. Display-only for the demo. */
export async function getCurrentUser() {
  return (await isAuthenticated())
    ? { name: DEMO_CREDENTIALS.name, email: DEMO_CREDENTIALS.email }
    : null;
}
