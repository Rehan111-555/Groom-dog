// app/api/auth/[...nextauth]/route.js

// --- Safe ESM/CJS interop imports (handle .default or function) ---
import NextAuthImport from "next-auth/next";
import GoogleProviderImport from "next-auth/providers/google";

const NextAuth =
  typeof NextAuthImport === "function" ? NextAuthImport : NextAuthImport?.default;
const GoogleProvider =
  typeof GoogleProviderImport === "function" ? GoogleProviderImport : GoogleProviderImport?.default;

if (!NextAuth || !GoogleProvider) {
  throw new Error("Failed to import next-auth or providers/google (interop).");
}

// --- Force Node runtime & disable static rendering for this API route ---
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// (Optional – extra belt & suspenders)
export const revalidate = 0;
export const fetchCache = "force-no-store";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// v4 App Router exports
export { handler as GET, handler as POST };
