import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import { validateRequest, registerSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await validateRequest(request, registerSchema);
    if (error) return error;

    const user = await registerUser(data.email, data.password, data.name);

    return NextResponse.json({ success: true, user: { email: user?.email } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
