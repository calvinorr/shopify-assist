import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Helper to check admin status
async function requireAdmin() {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    throw new Error("Authentication required");
  }

  const [dbUser] = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, currentUser.id))
    .limit(1);

  if (!dbUser?.isAdmin) {
    throw new Error("Admin access required");
  }

  return currentUser;
}

// GET /api/admin/users - List all registered users
export async function GET() {
  try {
    await requireAdmin();

    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    return NextResponse.json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("required") ? 403 : 500;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
