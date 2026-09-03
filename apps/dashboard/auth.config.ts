import type { NextAuthConfig } from "next-auth";

/** Edge-safe config shared by middleware and the full Node auth. No DB, no argon2. */
export const authConfig = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [], // real provider is added in auth.ts (Node runtime)
  callbacks: {
    jwt({ token, user }) {
      if (user) token.uid = (user as { id: string }).id;
      return token;
    },
    session({ session, token }) {
      if (token.uid) session.user.id = token.uid as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
