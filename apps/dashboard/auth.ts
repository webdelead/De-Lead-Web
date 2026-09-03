import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "@node-rs/argon2";
import { z } from "zod";
import { getDb, users, userVerticalAccess, eq, sql } from "@delead/db";
import { authConfig } from "./auth.config";

export type Grant = { vertical: string; level: "view" | "edit" };

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "super_admin" | "staff";
      grants: Grant[];
    } & DefaultSession["user"];
  }
}

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const db = getDb();
        const [u] = await db
          .select()
          .from(users)
          .where(sql`lower(${users.email}) = ${email.toLowerCase()}`)
          .limit(1);
        if (!u || !u.isActive) return null;
        const ok = await verify(u.passwordHash, password).catch(() => false);
        if (!ok) return null;
        await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, u.id));
        return { id: u.id, email: u.email, name: u.name };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      const uid = token.uid as string | undefined;
      if (!uid) return session;
      const db = getDb();
      const [u] = await db.select().from(users).where(eq(users.id, uid)).limit(1);
      if (!u || !u.isActive) {
        session.user.id = "";
        session.user.role = "staff";
        session.user.grants = [];
        return session;
      }
      const grants =
        u.role === "super_admin"
          ? []
          : await db
              .select({ vertical: userVerticalAccess.vertical, level: userVerticalAccess.level })
              .from(userVerticalAccess)
              .where(eq(userVerticalAccess.userId, uid));
      session.user.id = u.id;
      session.user.name = u.name;
      session.user.email = u.email;
      session.user.role = u.role;
      session.user.grants = grants as Grant[];
      return session;
    },
  },
});
