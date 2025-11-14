// app/api/auth/[...nextauth]/route.js
import * as NextAuthMod from "next-auth";
import * as GoogleProviderMod from "next-auth/providers/google";
import * as CredentialsProviderMod from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

/** ───────────── Resolve default-or-module exports safely ───────────── */
const NextAuth =
  (NextAuthMod && typeof NextAuthMod === "function" && NextAuthMod) ||
  (NextAuthMod && typeof NextAuthMod.default === "function" && NextAuthMod.default);

const GoogleProvider =
  (GoogleProviderMod && typeof GoogleProviderMod === "function" && GoogleProviderMod) ||
  (GoogleProviderMod && typeof GoogleProviderMod.default === "function" && GoogleProviderMod.default);

const CredentialsProvider =
  (CredentialsProviderMod && typeof CredentialsProviderMod === "function" && CredentialsProviderMod) ||
  (CredentialsProviderMod && typeof CredentialsProviderMod.default === "function" && CredentialsProviderMod.default);

if (!NextAuth) {
  throw new Error("next-auth module did not export a NextAuth() function. Check your next-auth version.");
}

/** ───────────── Prisma singleton ───────────── */
const g = globalThis;
const prisma = g.__prisma__ ?? new PrismaClient();
if (!g.__prisma__) g.__prisma__ = prisma;

/** ───────────── Route runtime hints ───────────── */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

/** ───────────── Auth options ───────────── */
const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        try {
          const email = String(creds?.email || "").toLowerCase().trim();
          const password = String(creds?.password || "");
          if (!email || !password) return null;

          const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, phone: true, passwordHash: true },
          });
          if (!user?.passwordHash) return null;

          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;

          return { id: user.id, name: user.name ?? null, email: user.email ?? email, phone: user.phone ?? null };
        } catch {
          return null;
        }
      },
    }),
  ],

  /** Use JWT sessions—faster & avoids DB write during auth callback */
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },

  pages: { signIn: "/signin" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.phone = user.phone ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name ?? null,
          email: token.email ?? null,
          phone: token.phone ?? null,
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
