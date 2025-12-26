import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { decode, encode } from "../../../utils/auth";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    theme: {
        colorScheme: "dark",
    },
    jwt: {
        encode: encode,
        decode: decode,
    },
    callbacks: {
        async jwt({ token }) {
            token.userRole = "admin";
            token.oauth = "google";
            return token;
        },
        // Helpful: Pass the role to the session so the frontend can see it
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.userRole;
            }
            return session;
        },
    },
};

// 2. Export the handler as the default export
export default NextAuth(authOptions);
