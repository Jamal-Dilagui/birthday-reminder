import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/user";
import { connectMongoDb } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectMongoDb();
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email }).select('+password');;
          if (!user) {
            throw new Error("No user found with this email");
          }

          
          // Compare passwords
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isValid) {
            throw new Error("Invalid password");
          }

          // Return user object without password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            whatsappNumber: user.whatsappNumber
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data in token
      if (user) {
        token.id = user.id;
        token.whatsappNumber = user.whatsappNumber;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data to session
      session.user.id = token.id;
      session.user.whatsappNumber = token.whatsappNumber;
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };