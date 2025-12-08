import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, allowedEmails } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { validateRequest, allowedEmailSchema } from "@/lib/validations";

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

// GET /api/admin/allowed-emails - List all allowed emails
export async function GET() {
  try {
    await requireAdmin();

    const emails = await db
      .select({
        id: allowedEmails.id,
        email: allowedEmails.email,
        addedBy: allowedEmails.addedBy,
        createdAt: allowedEmails.createdAt,
      })
      .from(allowedEmails)
      .orderBy(allowedEmails.createdAt);

    return NextResponse.json({
      success: true,
      data: emails,
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

// POST /api/admin/allowed-emails - Add a new allowed email
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAdmin();

    const { data, error } = await validateRequest(request, allowedEmailSchema);
    if (error) return error;

    // Check if email already exists
    const [existing] = await db
      .select()
      .from(allowedEmails)
      .where(eq(allowedEmails.email, data.email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already exists in allowed list" },
        { status: 409 }
      );
    }

    // Add the email
    const id = crypto.randomUUID();
    await db.insert(allowedEmails).values({
      id,
      email: data.email,
      addedBy: currentUser.id,
    });

    // Fetch the newly created record
    const [newEmail] = await db
      .select()
      .from(allowedEmails)
      .where(eq(allowedEmails.id, id))
      .limit(1);

    return NextResponse.json(
      {
        success: true,
        data: newEmail,
        message: "Email added to allowed list",
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("required") ? 403 : 500;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
