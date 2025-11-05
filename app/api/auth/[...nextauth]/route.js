import NextAuthImport from "next-auth/next";
import GoogleProviderImport from "next-auth/providers/google";
import CredentialsProviderImport from "next-auth/providers/credentials";

const NextAuth =
  typeof NextAuthImport === "function" ? NextAuthImport : NextAuthImport?.default;
const GoogleProvider =
  typeof GoogleProviderImport === "function" ? GoogleProviderImport : GoogleProviderImport?.default;
const CredentialsProvider =
  typeof CredentialsProviderImport === "function" ? CredentialsProviderImport : CredentialsProviderImport?.default;

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const g = globalThis;
const prisma = g.__prisma__ ?? new PrismaClient();
if (!g.__prisma__) g.__prisma__ = prisma;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const MAX_AGE = Number(process.env.SESSION_MAX_AGE_SECONDS || 1800);      // 30m default
const UPDATE_AGE = Number(process.env.SESSION_UPDATE_AGE_SECONDS || 300); // 5m default

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: false,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email?.toLowerCase() ?? null,
          image: profile.picture ?? null,
          emailVerified: new Date(), // trust Google
        };
      },
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

        // Require verification before allowing credentials login
        if (!user.emailVerified) {
          throw new Error("Email not verified");
        }

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? email,
          phone: user.phone ?? null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: MAX_AGE,
    updateAge: UPDATE_AGE,
  },
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user, account }) {
      const now = Date.now();

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone ?? token.phone ?? null;
        token.lastActivity = now;
      } else {
        const last = token.lastActivity ?? now;
        if (now - last > MAX_AGE * 1000) token.expired = true;
        else token.lastActivity = now;
      }

      // If Google just signed in, mark verified in DB (defensive)
      if (account?.provider === "google" && token?.email) {
        const u = await prisma.user.findUnique({ where: { email: token.email } });
        if (u && !u.emailVerified) {
          await prisma.user.update({
            where: { id: u.id },
            data: { emailVerified: new Date() },
          });
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.expired) session.expired = true;
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
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
