/**
 * Seed script to add admin email to allowlist
 * Run with: npx dotenv -e .env.local -- npx tsx scripts/seed-admin.ts
 */

import { db } from "../lib/db";
import { allowedEmails, users } from "../lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "calvin.orr@gmail.com";

async function seedAdmin() {
  console.log("Seeding admin email to allowlist...");

  // Check if already exists
  const [existing] = await db
    .select()
    .from(allowedEmails)
    .where(eq(allowedEmails.email, ADMIN_EMAIL))
    .limit(1);

  if (existing) {
    console.log(`✓ Email ${ADMIN_EMAIL} already in allowlist`);
  } else {
    await db.insert(allowedEmails).values({
      id: crypto.randomUUID(),
      email: ADMIN_EMAIL,
      addedBy: "seed-script",
    });
    console.log(`✓ Added ${ADMIN_EMAIL} to allowlist`);
  }

  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  if (existingUser) {
    console.log(`✓ User ${ADMIN_EMAIL} already exists`);
  } else {
    // Create admin user with temporary password
    const tempPassword = "ChangeMe123!";
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: ADMIN_EMAIL,
      passwordHash,
      name: "Calvin Orr",
      isAdmin: true,
    });
    console.log(`✓ Created admin user: ${ADMIN_EMAIL}`);
    console.log(`  Temporary password: ${tempPassword}`);
    console.log(`  ⚠️  Change this password after first login!`);
  }

  console.log("\nDone!");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});
