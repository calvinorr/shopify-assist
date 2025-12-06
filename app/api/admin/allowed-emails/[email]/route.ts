import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, allowedEmails } from "@/lib/schema";
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

// DELETE /api/admin/allowed-emails/[email] - Remove an allowed email
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    await requireAdmin();

    const { email } = await params;
    const emailToDelete = decodeURIComponent(email).toLowerCase().trim();

    // Check if email exists
    const [existing] = await db
      .select()
      .from(allowedEmails)
      .where(eq(allowedEmails.email, emailToDelete))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Email not found in allowed list" },
        { status: 404 }
      );
    }

    // Delete the email
    await db
      .delete(allowedEmails)
      .where(eq(allowedEmails.email, emailToDelete));

    return NextResponse.json({
      success: true,
      message: "Email removed from allowed list",
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
