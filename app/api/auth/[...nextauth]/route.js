// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// (optional) force Node runtime for safety (avoids Edge runtime issues)
export const runtime = "nodejs";

// NextAuth v4 config
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

// Create handler for App Router
const handler = NextAuth(authOptions);

// App Router needs GET/POST exports
export { handler as GET, handler as POST };
