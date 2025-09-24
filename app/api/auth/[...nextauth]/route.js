// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";                    // v4 import
import GoogleProvider from "next-auth/providers/google";

// Force Node runtime (NextAuth v4 does NOT support Edge)
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

const handler = NextAuth(authOptions);

// App Router requires GET/POST exports
export { handler as GET, handler as POST };
