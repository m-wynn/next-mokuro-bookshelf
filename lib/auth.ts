import prisma from "db";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify, hash } from "lib/password";
import { NextAuthOptions, User as AuthUser, Account, Profile } from "next-auth";
import { User } from "@prisma/client";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/error",
  },
  providers: [
    CredentialsProvider({
      name: "Username/Password",
      credentials: {},
      async authorize(credentials: any, _req): Promise<any> {
        const user = await prisma.user.findUnique({
          where: {
            name: credentials.username as string,
          },
        });

        if (user === null || !verify(user.password, credentials.password)) {
          return null;
        }

        const { password, ...newUser } = user;

        return newUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // todo?
      return true;
    },
    async register({ username, password, confirmPassword, inviteCode }) {
      let role = "READER";
      if ((await prisma.user.count()) == 0) {
        role = "ADMIN";
      }

      if (password !== confirmPassword) {
        return false;
      }
      if (inviteCode !== process.env.INVITE_CODE) {
        return false;
      }

      const user = await prisma.user.create({
        data: {
          name: username,
          password: hash(password),
          role: role,
        },
      });
    },
    async jwt({ token, user }) {
      const u = user as unknown as User;
      if (u) {
        token.id = u.id;
        token.role = u.role;
      }

      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
};
