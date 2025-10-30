import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";

// Function to generate a secure random password
function generateSecurePassword(length: number = 16): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(crypto.randomInt(0, charset.length));
  }
  return password;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development",
  pages : {
    signIn: '/login',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
    },
  events: {
    user: {
      created: async (user: { id: string; email: string; password?: string }) => {
        // Check if this user was created via OAuth (has no password)
        if (!user.password && user.email) {
          try {
            // Generate a secure random password for OAuth users
            const randomPassword = generateSecurePassword();
            
            // Use bcrypt to hash the password
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.hash(randomPassword, 12);
            
            // Update the user with the hashed password
            await db.update(schema.user)
              .set({ password: hashedPassword })
              .where(eq(schema.user.id, user.id));
            
            console.log(`Generated password for OAuth user: ${user.email}`);
            // Store the plain password temporarily for potential user notification
            // In production, you might want to email this to the user or prompt them to change it
          } catch (error) {
            console.error("Error generating password for OAuth user:", error);
          }
        }
      },
    },
  },
});

