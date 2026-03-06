"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { ActionResult, User } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  createHmac,
  scrypt,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

// Use an env-configured secret for HMAC signing, with a dev fallback.
// In production, set SESSION_SECRET to a long random string.
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "change-me-in-production-use-a-long-random-string";

function signSessionValue(userId: number): string {
  const payload = String(userId);
  const sig = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifySessionValue(value: string): number | null {
  const dotIndex = value.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const payload = value.slice(0, dotIndex);
  const sig = value.slice(dotIndex + 1);
  const expected = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  // Constant-time comparison to prevent timing attacks
  const expectedBuf = Buffer.from(expected, "hex");
  const sigBuf = Buffer.from(sig, "hex");
  if (expectedBuf.length !== sigBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, sigBuf)) return null;
  const id = Number(payload);
  return Number.isNaN(id) ? null : id;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const [salt, storedKey] = hash.split(":");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(storedKey, "hex");
  return timingSafeEqual(derivedKey, storedBuffer);
}

const SESSION_COOKIE = "auth_session";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(255),
});

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<ActionResult<Omit<User, "passwordHash">>> {
  const parsed = registerSchema.safeParse({ email, password, name });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email.toLowerCase()),
  });
  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const [user] = await db
    .insert(users)
    .values({
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      name: parsed.data.name,
    })
    .returning();

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signSessionValue(user.id), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  const { passwordHash: _, ...safeUser } = user;
  return { success: true, data: safeUser };
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(
  email: string,
  password: string,
): Promise<ActionResult<Omit<User, "passwordHash">>> {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { success: false, error: "Invalid email or password" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email.toLowerCase()),
  });

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signSessionValue(user.id), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  const { passwordHash: _, ...safeUser } = user;
  return { success: true, data: safeUser };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  revalidatePath("/");
}

export async function getCurrentUser(): Promise<Omit<User, "passwordHash"> | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE)?.value;
  if (!cookieValue) return null;

  const userId = verifySessionValue(cookieValue);
  if (!userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return null;

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export async function updateProfile(
  name: string,
  email: string,
): Promise<ActionResult<Omit<User, "passwordHash">>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const schema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email(),
  });
  const parsed = schema.safeParse({ name, email });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [updated] = await db
    .update(users)
    .set({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .returning();

  if (!updated) return { success: false, error: "User not found" };

  const { passwordHash: _, ...safeUser } = updated;
  revalidatePath("/account");
  return { success: true, data: safeUser };
}

export async function getAllUsers(options?: {
  limit?: number;
  offset?: number;
}): Promise<Omit<User, "passwordHash">[]> {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .limit(options?.limit ?? 100)
    .offset(options?.offset ?? 0);
  return rows;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  if (newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters" };
  }

  const fullUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });
  if (!fullUser) return { success: false, error: "User not found" };

  const valid = await verifyPassword(currentPassword, fullUser.passwordHash);
  if (!valid) return { success: false, error: "Current password is incorrect" };

  const newHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { success: true, data: undefined };
}
