// app/api/auth/[...nextauth]/route.js
export const runtime = "nodejs"; // force Node runtime (not Edge)

import NextAuth from "next-auth/next";                 // <-- v4 API
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };            // App Router shape
