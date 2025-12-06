import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogIdeas } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

/**
 * Update a blog idea's status
 * PATCH /api/blog/ideas/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const { status, createdPostId } = body;

    if (!status || !["dismissed", "used"].includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status",
          message: "Status must be either 'dismissed' or 'used'",
        },
        { status: 400 }
      );
    }

    // Check if idea exists
    const existingIdea = await db
      .select()
      .from(blogIdeas)
      .where(eq(blogIdeas.id, id))
      .limit(1);

    if (existingIdea.length === 0) {
      return NextResponse.json(
        {
          error: "Not found",
          message: `Blog idea with id '${id}' not found`,
        },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: {
      status: "dismissed" | "used";
      usedAt?: Date;
      createdPostId?: string;
    } = {
      status,
    };

    // If marking as used, set usedAt timestamp and createdPostId
    if (status === "used") {
      updateData.usedAt = new Date();
      if (createdPostId) {
        updateData.createdPostId = createdPostId;
      }
    }

    // Update the idea
    await db
      .update(blogIdeas)
      .set(updateData)
      .where(eq(blogIdeas.id, id));

    // Fetch and return the updated idea
    const updatedIdea = await db
      .select()
      .from(blogIdeas)
      .where(eq(blogIdeas.id, id))
      .limit(1);

    return NextResponse.json({
      idea: {
        id: updatedIdea[0].id,
        title: updatedIdea[0].title,
        hook: updatedIdea[0].hook,
        keywords: JSON.parse(updatedIdea[0].keywords),
        type: updatedIdea[0].type,
        seasonalRelevance: updatedIdea[0].seasonalRelevance,
        status: updatedIdea[0].status,
        generatedAt: updatedIdea[0].generatedAt,
        usedAt: updatedIdea[0].usedAt,
        createdPostId: updatedIdea[0].createdPostId,
      },
      message: `Blog idea marked as ${status}`,
    });

  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Blog idea update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update blog idea",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
