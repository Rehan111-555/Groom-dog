// app/api/auth/[...nextauth]/route.js

// Safe ESM/CJS interop (works on Vercel)
import NextAuthImport from "next-auth/next";
import GoogleProviderImport from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const NextAuth =
  typeof NextAuthImport === "function" ? NextAuthImport : NextAuthImport?.default;
const GoogleProvider =
  typeof GoogleProviderImport === "function" ? GoogleProviderImport : GoogleProviderImport?.default;

if (!NextAuth || !GoogleProvider) {
  throw new Error("Failed to import next-auth or providers/google (interop).");
}

// Reuse Prisma across hot reloads (prevents “already running” in dev)
const g = globalThis;
const prisma = g.__prisma__ ?? new PrismaClient();
if (!g.__prisma__) g.__prisma__ = prisma;

// Force Node runtime & disable caching for this API route
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
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id; // persist DB user id
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.uid) session.user.id = token.uid; // expose on session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
