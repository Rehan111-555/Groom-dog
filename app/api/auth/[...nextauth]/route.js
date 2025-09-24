// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth/next";           // v4 API (Node runtime)
import GoogleProvider from "next-auth/providers/google";

export const runtime = "nodejs";                 // make sure NOT Edge
export const dynamic = "force-dynamic";          // never statically analyzed

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

// App Router needs these exports for v4
export { handler as GET, handler as POST };
