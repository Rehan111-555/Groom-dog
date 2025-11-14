// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

/** ───────────────── Prisma singleton ───────────────── */
const g = globalThis;
const prisma = g.__prisma__ ?? new PrismaClient();
if (!g.__prisma__) g.__prisma__ = prisma;

/** ───────────────── Route runtime hints ─────────────── */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

/** ───────────────── Auth options ────────────────────── */
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

          // Return a minimal user object
          return { id: user.id, name: user.name ?? null, email: user.email ?? email, phone: user.phone ?? null };
        } catch (e) {
          // Never throw here—return null to signal invalid login
          return null;
        }
      },
    }),
  ],

  /** Use JWT sessions for speed/reliability */
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,   // 30 minutes
  },

  pages: { signIn: "/signin" },

  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, merge user fields into token
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
  // debug: true, // uncomment locally if you want verbose logs
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
