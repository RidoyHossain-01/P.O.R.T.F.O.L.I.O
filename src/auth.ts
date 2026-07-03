import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // First-run setup check: automatically register the first login as the single admin user
        const userCount = await prisma.user.count();
        
        if (userCount === 0) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newAdmin = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              name: "Administrator", 
            },
          });
          return {
            id: newAdmin.id,
            email: newAdmin.email,
            name: newAdmin.name,
          };
        }

        // Fetch the user from database
        const user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }


        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
