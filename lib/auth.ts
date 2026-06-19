import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongo } from "@/lib/mongodb";
import ForumUser from "@/lib/models/ForumUser";
import ForumOTP from "@/lib/models/ForumOTP";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
/*
    CredentialsProvider({
      id: "google-one-tap",
      name: "Google One Tap",
      credentials: {
        credential: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.credential) throw new Error("No credential provided");
        
        try {
          const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
          const ticket = await client.verifyIdToken({
            idToken: credentials.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          
          const payload = ticket.getPayload();
          if (!payload) throw new Error("Invalid token payload");
          
          const { email, name, picture } = payload;
          if (!email) throw new Error("No email in token");

          await connectMongo();
          
          let user = await ForumUser.findOne({ email });
          if (!user) {
            user = await ForumUser.create({
              email,
              name: name || undefined,
              avatar: picture || undefined,
              provider: "google",
              emailVerified: true,
            });
          } else if (!user.avatar && picture) {
            user.avatar = picture;
            await user.save();
          }

          return { id: user._id.toString(), email: user.email, name: user.name, image: user.avatar };
        } catch (error) {
          console.error("Google One Tap Error:", error);
          throw new Error("Google Verification Failed");
        }
      }
    }),
    */
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" }, // Optional
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Missing email or OTP");
        }

        const email = String(credentials.email).trim().toLowerCase();
        const otp = String(credentials.otp).trim();

        await connectMongo();

        const otpRecord = await ForumOTP.findOne({ 
          email: { $regex: new RegExp(`^${email}$`, 'i') } 
        });

        if (!otpRecord) {
          throw new Error("Invalid or expired OTP");
        }

        if (otpRecord.expiresAt < new Date()) {
          await ForumOTP.deleteOne({ _id: otpRecord._id });
          throw new Error("OTP has expired");
        }

        if (otpRecord.attempts >= 3) {
          await ForumOTP.deleteOne({ _id: otpRecord._id });
          throw new Error("Too many attempts. Please request a new OTP.");
        }

        if (otpRecord.otp !== otp) {
          otpRecord.attempts += 1;
          await otpRecord.save();
          throw new Error("Invalid OTP");
        }

        // OTP is valid, delete it
        await ForumOTP.deleteOne({ _id: otpRecord._id });

        // Find or create ForumUser
        let user = await ForumUser.findOne({ 
          email: { $regex: new RegExp(`^${email}$`, 'i') } 
        });

        if (!user) {
          // If they didn't provide a name, it means they used the "Sign In" tab instead of "Sign Up"
          // Note: NextAuth serializes undefined to the literal string "undefined"
          if (!credentials.name || credentials.name === "undefined" || credentials.name.trim() === "") {
            throw new Error("Account does not exist. Please sign up instead.");
          }
          
          user = await ForumUser.create({
            email,
            name: credentials.name,
            provider: "email",
            emailVerified: true,
          });
        } else if (credentials.name && !user.name) {
          user.name = credentials.name;
          await user.save();
        }

        return { id: user._id.toString(), email: user.email, name: user.name, image: user.avatar };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Explicitly allow redirects to the Classgrid Forum
      if (url.startsWith("https://forum.classgrid.in")) return url;
      // Allow callback URLs on the same origin
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch (e) {}
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github" || account?.provider === "linkedin") {
        console.log(`[NextAuth] ${account.provider} sign-in — email: ${user.email}, name: ${user.name}`);
        
        // LinkedIn sometimes doesn't return email — reject if missing
        if (!user.email) {
          console.error(`[NextAuth] ${account.provider} sign-in failed: no email returned`);
          return false;
        }

        await connectMongo();
        let forumUser = await ForumUser.findOne({ 
          email: { $regex: new RegExp(`^${user.email}$`, 'i') } 
        });

        if (!forumUser) {
          forumUser = await ForumUser.create({
            email: user.email,
            name: user.name,
            avatar: user.image,
            provider: account.provider,
            emailVerified: true,
          });
        } else if (!forumUser.avatar && user.image) {
          forumUser.avatar = user.image;
          await forumUser.save();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        
        // Check if user exists in the platform's User collection
        try {
          await connectMongo();
          const db = mongoose.connection.db;
          if (db) {
            const platformUser = await db.collection("users").findOne({ 
              email: { $regex: new RegExp(`^${user.email}$`, 'i') } 
            });
            if (platformUser) {
              token.isPlatformUser = true;
              token.platformRole = platformUser.role;
              
              if (platformUser.organization_id) {
                token.orgId = platformUser.organization_id.toString();
                // Look up org name from organizations collection
                const org = await db.collection("organizations").findOne({ _id: platformUser.organization_id });
                token.orgName = org?.name || null;
              }

              await ForumUser.updateOne(
                { email: { $regex: new RegExp(`^${user.email}$`, 'i') } },
                { $set: { isPlatformUser: true } }
              );
            } else {
              token.isPlatformUser = false;
            }

            // Get username + createdAt from ForumUser
            const forumUser = await ForumUser.findOne({ 
              email: { $regex: new RegExp(`^${user.email}$`, 'i') } 
            }).select("username createdAt");
            if (forumUser) {
              token.forumCreatedAt = forumUser.createdAt?.toISOString();
              token.forumUsername = forumUser.username || null;
            }
          }
        } catch (error) {
          console.error("Error checking platform user status:", error);
          token.isPlatformUser = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).isPlatformUser = token.isPlatformUser as boolean;
        (session.user as any).platformRole = token.platformRole as string | undefined;
        (session.user as any).orgName = token.orgName as string | undefined;
        (session.user as any).orgId = token.orgId as string | undefined;
        (session.user as any).forumCreatedAt = token.forumCreatedAt as string | undefined;
        (session.user as any).forumUsername = token.forumUsername as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
