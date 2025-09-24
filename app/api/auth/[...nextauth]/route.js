// Force v4 handler + Node runtime (Edge will break)
export const runtime = "nodejs";

import NextAuth from "next-auth/next";                 // <— use /next to force v4 API
import GoogleProvider from "next-auth/providers/google";

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

// v4 returns a request handler function
const handler = NextAuth(authOptions);

// App Router requires these named exports
export { handler as GET, handler as POST };
