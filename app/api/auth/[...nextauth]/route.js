// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth/next";               // v4 handler for App Router
import GoogleProvider from "next-auth/providers/google";

// Force Node runtime (good for server-only libs)
export const runtime = "nodejs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

// App Router needs GET/POST exports
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
