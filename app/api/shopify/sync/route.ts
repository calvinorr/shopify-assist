import { NextResponse } from "next/server";
import { syncProductsToDb } from "@/services/shopify";

export async function POST() {
  try {
    const result = await syncProductsToDb();

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Successfully synced ${result.synced} products`
        : `Synced ${result.synced} products with errors`,
      synced: result.synced,
      errors: result.errors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message, synced: 0, errors: [message] },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Use POST to trigger a sync" },
    { status: 405 }
  );
}
