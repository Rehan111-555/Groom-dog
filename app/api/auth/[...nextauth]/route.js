// app/api/auth/[...nextauth]/route.js
import NextAuthImport from "next-auth/next";           // ← v4 server handler
import GoogleProviderImport from "next-auth/providers/google";
import CredentialsProviderImport from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

const NextAuth =
  typeof NextAuthImport === "function" ? NextAuthImport : NextAuthImport?.default;
const GoogleProvider =
  typeof GoogleProviderImport === "function" ? GoogleProviderImport : GoogleProviderImport?.default;
const CredentialsProvider =
  typeof CredentialsProviderImport === "function" ? CredentialsProviderImport : CredentialsProviderImport?.default;

if (typeof NextAuth !== "function") {
  throw new Error("next-auth/next did not export a NextAuth() handler; ensure next-auth v4 is installed.");
}

const g = globalThis;
const prisma = g.__prisma__ ?? new PrismaClient();
if (!g.__prisma__) g.__prisma__ = prisma;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
        if (!creds?.email || !creds?.password) return null;
        const email = String(creds.email).toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, phone: true, passwordHash: true },
        });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name ?? null, email: user.email ?? email, phone: user.phone ?? null };
      },
    }),
  ],

  // Keep JWT sessions to avoid DB write latency during callback
  session: { strategy: "jwt", maxAge: 30 * 60 },

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
