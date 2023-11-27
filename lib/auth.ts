import prisma from "db";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify, hash } from "lib/password";
import { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
  pages: {
    // signIn: "/login",
    error: "/error",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "Username/Password",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "renge" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "ny@np@55u",
        },
      },
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
    CredentialsProvider({
      id: "register",
      name: "Register",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "renge" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "ny@np@55u",
        },
      },
      async authorize(credentials: any, _req): Promise<any> {
        console.log("credentials: ", credentials);
        try {
          const userExists = await prisma.user.findUnique({
            where: {
              name: credentials.username as string,
            },
          });

          if (userExists !== null) {
            return null;
          }

          const hashed = await hash(credentials.password);

          const user = prisma.user.create({
            data: {
              name: credentials.username,
              password: hashed,
            },
          });
          return user;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
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
