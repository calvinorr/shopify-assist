import NextAuth from "next-auth";
import type { NextAuthConfig, Session, User } from "next-auth";

// Dev user for bypass mode
const DEV_USER: User = {
  id: "dev-user-001",
  email: "dev@shopify-assist.local",
  name: "Dev User",
  image: null,
};

const DEV_SESSION: Session = {
  user: DEV_USER,
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
};

// Check if dev bypass is enabled
export const isDevBypass = process.env.DEV_BYPASS_AUTH === "true";

const authConfig: NextAuthConfig = {
  providers: [
    // Credentials provider for future email/password login
    // Add Shopify OAuth, Instagram OAuth here when ready
  ],
  callbacks: {
    authorized({ auth, request }) {
      // In dev bypass mode, always authorize
      if (isDevBypass) {
        return true;
      }
      return !!auth?.user;
    },
    session({ session, token }) {
      // In dev bypass mode, return dev session
      if (isDevBypass) {
        return DEV_SESSION;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Helper to get current user (works in both dev and prod)
export async function getCurrentUser(): Promise<User | null> {
  if (isDevBypass) {
    return DEV_USER;
  }
  const session = await auth();
  return session?.user ?? null;
}

// Helper to require authentication (throws if not authenticated)
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
