#!/usr/bin/env tsx

/**
 * Database cleanup script runner
 * This script removes duplicate users and properly links accounts
 */

import { cleanupDuplicateUsers } from './cleanup-duplicates';

console.log("🧹 Running database cleanup for duplicate users...\n");

cleanupDuplicateUsers()
  .then(() => {
    console.log("\n🎉 Database cleanup completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Database cleanup failed:", error);
    process.exit(1);
  });