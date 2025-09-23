import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// NextAuth v5 minimal setup. Users are created automatically on first sign-in.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt" },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
