// app/api/auth/[...nextauth]/route.js
import NextAuthImport from "next-auth/next";
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

const g = globalThis;
const prisma = g.__prisma__ ?? new PrismaClient();
if (!g.__prisma__) g.__prisma__ = prisma;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const authOptions = {
  // ►► ADAPTER: persist users/accounts/sessions in your Prisma tables
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

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? email,
          phone: user.phone ?? null,
        };
      },
    }),
  ],

  // ►► DATABASE sessions (so Session table is used / deleted on signout)
  session: {
    strategy: "database",
    maxAge: 30 * 60,     // 30 minutes total lifetime
    updateAge: 5 * 60,   // extend every 5 minutes while active (rolling)
  },

  pages: { signIn: "/signin" },

  callbacks: {
    // NOTE: with strategy:"database", `user` is set here; `token` may be undefined.
    async session({ session, token, user }) {
      const src = user ?? token; // support either strategy
      if (src) {
        session.user = {
          id: src.id,
          name: src.name ?? null,
          email: src.email ?? null,
          phone: src.phone ?? null,
        };
      }
      return session;
    },

    // Keep this for completeness (helps if you ever switch back to jwt in tests)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.phone = user.phone ?? null;
      } else if (token?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email.toLowerCase() },
            select: { id: true, name: true, email: true, phone: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.phone = dbUser.phone ?? null;
          }
        } catch {}
      }
      return token;
    },
  },

  // Not strictly required; the adapter deletes the DB session on signOut.
  events: {},

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
