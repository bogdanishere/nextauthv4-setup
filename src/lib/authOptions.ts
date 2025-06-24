// import bcrypt from "bcryptjs";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import type { NextAuthOptions } from "next-auth";
// import { encode as defaultEncode } from "next-auth/jwt";
// import { v4 as uuid } from "uuid";

// import prisma from "@/lib/prisma";
// import Credentials from "next-auth/providers/credentials";

// const adapter = PrismaAdapter(prisma);

// export const authOptions: NextAuthOptions = {
//   adapter,
//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60, // 1 day
//     updateAge: 24 * 60 * 60, // 24 hours
//   },
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: " Email" },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Password",
//         },
//       },
//       authorize: async (credentials) => {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password are required");
//         }
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });
//         if (!user) {
//           throw new Error("No user found with the given email");
//         }

//         const isValidPassword = await bcrypt.compare(
//           credentials.password,
//           user.password || ""
//         );
//         if (!isValidPassword) {
//           throw new Error("Invalid password");
//         }
//         return user;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account?.provider === "credentials") {
//         token.credentials = true;
//       }
//       return token;
//     },
//   },

//   jwt: {
//     encode: async function (params) {
//       if (params.token?.credentials) {
//         const sessionToken = uuid();

//         if (!params.token.sub) {
//           throw new Error("No user ID found in token");
//         }

//         const createdSession = await adapter?.createSession?.({
//           sessionToken: sessionToken,
//           userId: params.token.sub,
//           expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         });

//         if (!createdSession) {
//           throw new Error("Failed to create session");
//         }

//         return sessionToken;
//       }
//       return defaultEncode(params);
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.users.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("No user found with the email");
        }

        const isValid = await bcrypt.compare(password!, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || "";
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = (session.user ?? {}) as {
          id: string;
          email: string;
          name: string;
          isAdmin: boolean;
        };
        session.user.email = token.email ?? "";
        session.user.id = (token.id as string) ?? "";
        session.user.isAdmin =
          (token as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
