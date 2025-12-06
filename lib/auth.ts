import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig, Session, User } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, allowedEmails } from "./schema";
import { eq } from "drizzle-orm";

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
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email.toLowerCase()))
          .limit(1);

        if (!user || !user.passwordHash) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
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
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
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

// Helper to check if email is allowed to register
export async function isEmailAllowed(email: string): Promise<boolean> {
  const [allowed] = await db
    .select()
    .from(allowedEmails)
    .where(eq(allowedEmails.email, email.toLowerCase()))
    .limit(1);
  return !!allowed;
}

// Helper to register a new user (only if email is allowed)
export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<User | null> {
  const normalizedEmail = email.toLowerCase();

  // Check if email is allowed
  const allowed = await isEmailAllowed(normalizedEmail);
  if (!allowed) {
    throw new Error("Email not authorized. Contact admin for access.");
  }

  // Check if user already exists
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    throw new Error("User already exists");
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  await db.insert(users).values({
    id,
    email: normalizedEmail,
    passwordHash,
    name: name || normalizedEmail.split("@")[0],
  });

  return {
    id,
    email: normalizedEmail,
    name: name || normalizedEmail.split("@")[0],
    image: null,
  };
}
