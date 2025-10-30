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
        // Only run for OAuth users (no password) and when email exists
        if (!user.password && user.email) {
          try {
            // Check if another user with this email already exists
            const existingUser = await db.query.user.findFirst({
              where: eq(schema.user.email, user.email),
              columns: { id: true, email: true, password: true, name: true, image: true, emailVerified: true }
            });

            // If we found another user with the same email (not the one just created)
            if (existingUser && existingUser.id !== user.id) {
              console.log(`Found existing user with email ${user.email}. Linking accounts...`);
              
              // Move the account from the new user to the existing user
              await db.update(schema.account)
                .set({ userId: existingUser.id })
                .where(eq(schema.account.userId, user.id));

              // Move any sessions from the new user to the existing user
              await db.update(schema.session)
                .set({ userId: existingUser.id })
                .where(eq(schema.session.userId, user.id));

              // Update existing user with OAuth info if missing
              const updateData: Partial<typeof schema.user.$inferInsert> = {};
              if (!existingUser.image && user.id) {
                // Get the new user's image from the database
                const newUserData = await db.query.user.findFirst({
                  where: eq(schema.user.id, user.id),
                  columns: { image: true }
                });
                if (newUserData?.image) {
                  updateData.image = newUserData.image;
                }
              }
              if (!existingUser.emailVerified) {
                updateData.emailVerified = true;
              }
              
              if (Object.keys(updateData).length > 0) {
                await db.update(schema.user)
                  .set(updateData)
                  .where(eq(schema.user.id, existingUser.id));
              }

              // If existing user doesn't have a password, generate one
              if (!existingUser.password) {
                const randomPassword = generateSecurePassword();
                const bcrypt = await import('bcryptjs');
                const hashedPassword = await bcrypt.hash(randomPassword, 12);
                
                await db.update(schema.user)
                  .set({ password: hashedPassword })
                  .where(eq(schema.user.id, existingUser.id));
              }

              // Delete the duplicate user that was just created
              await db.delete(schema.user)
                .where(eq(schema.user.id, user.id));

              console.log(`Successfully linked OAuth account to existing user: ${existingUser.email}`);
              return; // Exit early since we've handled the linking
            }

            // If no existing user found, this is a new OAuth user - generate password
            const randomPassword = generateSecurePassword();
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.hash(randomPassword, 12);
            
            await db.update(schema.user)
              .set({ password: hashedPassword })
              .where(eq(schema.user.id, user.id));
            
            console.log(`Generated password for new OAuth user: ${user.email}`);
          } catch (error) {
            console.error("Error handling OAuth user creation:", error);
          }
        }
      },
    },
  },
});

