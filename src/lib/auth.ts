import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/", // send to landing page — no dedicated login page needed
    error: "/", // send errors to landing page
  },
  providers: [
    // Email + password (credentials) — for users who want a simple account
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: implement user lookup + password hash verification
        // For now, require a configured admin user or skip credentials auth
        // In production: find user by email, compare hashed password, return user object
        if (!credentials?.email || !credentials?.password) return null;

        // Placeholder — replace with real user lookup + bcrypt comparison
        // const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
        // if (!user) return null;
        // const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        // if (!isValid) return null;
        // return { id: user.id, email: user.email, name: user.name };
        return null; // credentials auth disabled until user store is populated
      },
    }),

    // GitHub OAuth — for users who prefer social login
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Attach user ID to session so API routes can look up the user
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // On sign-in, persist user id in the JWT
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  // Trust the proxy (Vercel) for HTTPS detection
  trustHost: true,
});
