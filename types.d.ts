import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    isAdmin: boolean;
  }
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isAdmin: boolean;
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    isAdmin: boolean;
    email: string;
  }
}

// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth" {
//   interface User {
//     isAdmin: boolean;
//   }
// }

// declare module "next-auth" {
//   interface User {
//     isAdmin: boolean;
//   }

//   interface Session {
//     user: {
//       id: string;
//       email: string;
//       name?: string | null;
//       image?: string | null;
//       role: string;
//     };
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: string;
//   }
// }
