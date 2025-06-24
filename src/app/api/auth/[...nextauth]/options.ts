import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw Error("Missing Email or Password");
        }
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw Error("No user found with the provided email");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw Error("Invalid password");
          }

          return {
            id: user.id.toString(),
            email: user.email,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.isAdmin ? "admin" : "user"; // Set role based on isAdmin
        token.email = user.email || ""; // Ensure email is always set
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Add role to session
        session.user.email = token.email as string; // Add email to session
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Only redirect to home page after successful sign in
      // If there's an error, stay on the current page
      if (url.includes("error")) {
        return url; // Stay on error page
      }

      // Redirect to home page only after successful authentication
      if (url === baseUrl + "/api/auth/callback/credentials") {
        return baseUrl + "/";
      }

      // Allow callback URLs on the same origin
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default redirect for successful sign in
      return baseUrl + "/";
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
