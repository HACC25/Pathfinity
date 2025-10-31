import { db } from "@/app/db";
import * as schema from "@/app/db/schema";
import { eq } from "drizzle-orm";

/**
 * Database cleanup script to fix existing duplicate users
 * Run this once to clean up any duplicate users that were created before the account linking fix
 */
async function cleanupDuplicateUsers() {
  console.log("Starting database cleanup for duplicate users...");
  
  try {
    // Get all users grouped by email
    const allUsers = await db.query.user.findMany({
      orderBy: [schema.user.email, schema.user.createdAt],
    });

    // Group users by email
    const usersByEmail = new Map<string, typeof allUsers>();
    for (const user of allUsers) {
      if (!usersByEmail.has(user.email)) {
        usersByEmail.set(user.email, []);
      }
      usersByEmail.get(user.email)!.push(user);
    }

    let cleanedCount = 0;

    // Process each email group
    for (const [email, users] of usersByEmail) {
      if (users.length > 1) {
        console.log(`Found ${users.length} users with email: ${email}`);
        
        // Sort users to determine primary user
        // Priority: 1) User with password, 2) Oldest user
        const sortedUsers = users.sort((a, b) => {
          if (a.password && !b.password) return -1;
          if (!a.password && b.password) return 1;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        const primaryUser = sortedUsers[0];
        const duplicateUsers = sortedUsers.slice(1);

        console.log(`Primary user: ${primaryUser.id} (${primaryUser.email})`);
        console.log(`Duplicate users: ${duplicateUsers.map(u => u.id).join(', ')}`);

        // Move all accounts and sessions from duplicate users to primary user
        for (const duplicateUser of duplicateUsers) {
          // Move accounts
          await db.update(schema.account)
            .set({ userId: primaryUser.id })
            .where(eq(schema.account.userId, duplicateUser.id));

          // Move sessions
          await db.update(schema.session)
            .set({ userId: primaryUser.id })
            .where(eq(schema.session.userId, duplicateUser.id));

          // Update primary user with any missing information
          const updateData: Partial<typeof schema.user.$inferInsert> = {};
          
          if (!primaryUser.image && duplicateUser.image) {
            updateData.image = duplicateUser.image;
          }
          if (!primaryUser.emailVerified && duplicateUser.emailVerified) {
            updateData.emailVerified = duplicateUser.emailVerified;
          }
          if (!primaryUser.password && duplicateUser.password) {
            updateData.password = duplicateUser.password;
          }

          if (Object.keys(updateData).length > 0) {
            await db.update(schema.user)
              .set(updateData)
              .where(eq(schema.user.id, primaryUser.id));
            console.log(`Updated primary user with data from duplicate user`);
          }

          // Delete the duplicate user
          await db.delete(schema.user)
            .where(eq(schema.user.id, duplicateUser.id));
          
          console.log(`Deleted duplicate user: ${duplicateUser.id}`);
          cleanedCount++;
        }

        // Ensure primary user has a password if none exists
        if (!primaryUser.password) {
          const crypto = await import('crypto');
          const bcrypt = await import('bcryptjs');
          
          const randomPassword = crypto.randomBytes(16).toString('hex');
          const hashedPassword = await bcrypt.hash(randomPassword, 12);
          
          await db.update(schema.user)
            .set({ password: hashedPassword })
            .where(eq(schema.user.id, primaryUser.id));
          
          console.log(`Generated password for primary user: ${primaryUser.email}`);
        }
      }
    }

    console.log(`\n✅ Cleanup completed! Removed ${cleanedCount} duplicate users.`);
    
    // Show final user count
    const finalCount = await db.query.user.findMany();
    console.log(`📊 Total users after cleanup: ${finalCount.length}`);
    
    // Show accounts count
    const accountsCount = await db.query.account.findMany();
    console.log(`📊 Total accounts: ${accountsCount.length}`);

  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

// Run the cleanup if this file is executed directly
if (require.main === module) {
  cleanupDuplicateUsers()
    .then(() => {
      console.log("Cleanup script finished.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Cleanup script failed:", error);
      process.exit(1);
    });
}

export { cleanupDuplicateUsers };