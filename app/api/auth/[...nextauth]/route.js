// app/api/auth/[...nextauth]/route.js

// --- Safe ESM/CJS interop imports (works on Vercel) ---
import NextAuthImport from "next-auth/next";
import GoogleProviderImport from "next-auth/providers/google";

const NextAuth =
  typeof NextAuthImport === "function" ? NextAuthImport : NextAuthImport?.default;
const GoogleProvider =
  typeof GoogleProviderImport === "function" ? GoogleProviderImport : GoogleProviderImport?.default;

if (!NextAuth || !GoogleProvider) {
  throw new Error("Failed to import next-auth or providers/google (interop).");
}

// Force Node runtime & no caching for auth
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// IMPORTANT: pages.signIn tells the middleware to use /signin
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  // (optional) allow any URL you pass as callbackUrl to be used
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If it's a relative URL or same-origin, allow it
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {}
      // fallback to home
      return baseUrl + "/";
    },
  },
};

const handler = NextAuth(authOptions);

// NextAuth App Router handlers
export { handler as GET, handler as POST };
