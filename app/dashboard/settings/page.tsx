"use client";

import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Store,
  Palette,
  ChevronRight,
  Check,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Loader2,
  Mail,
  Lock,
  UserCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

type TabId = "profile" | "admin" | "shopify" | "preferences";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const tabs: Tab[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "admin", label: "Admin", icon: Shield, adminOnly: true },
  { id: "shopify", label: "Shopify", icon: Store },
  { id: "preferences", label: "Preferences", icon: Palette },
];

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
}

interface AllowedEmail {
  id: string;
  email: string;
  addedBy: string | null;
  createdAt: string;
}

interface ShopifyStatus {
  connected: boolean;
  lastSyncAt: string | null;
  productCount: number;
  storeUrl: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const visibleTabs = tabs.filter(
    (tab) => !tab.adminOnly || profile?.isAdmin
  );

  return (
    <div className="min-h-screen p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-light tracking-tight mb-2"
          style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
        >
          Settings
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your account, connections, and preferences
        </p>
      </div>

      {/* Main Layout: Sidebar Tabs + Content */}
      <div className="flex gap-8">
        {/* Vertical Tab Navigation */}
        <nav
          className="w-56 flex-shrink-0 rounded-xl p-2"
          style={{
            backgroundColor: "var(--walnut-light)",
            border: "1px solid var(--card-border)",
          }}
        >
          <div className="space-y-1">
            {visibleTabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? "var(--card-bg)" : "transparent",
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    boxShadow: isActive
                      ? "0 2px 8px rgba(45, 42, 38, 0.08)"
                      : "none",
                    transform: isActive ? "translateX(4px)" : "translateX(0)",
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <span
                    className="w-4 h-4 transition-colors duration-200"
                    style={{
                      color: isActive ? "var(--weld)" : "var(--text-muted)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 text-left">{tab.label}</span>
                  <span
                    className="w-4 h-4 transition-all duration-200"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateX(0)" : "translateX(-8px)",
                      color: "var(--weld)",
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Decorative divider */}
          <div
            className="my-4 h-px mx-4"
            style={{
              background: "linear-gradient(to right, transparent, var(--card-border), transparent)",
            }}
          />

          {/* Version info */}
          <div className="px-4 py-2">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Herbarium Studio
            </p>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              v1.0.0
            </p>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 max-w-2xl">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div
              key={activeTab}
              className="animate-in fade-in slide-in-from-right-4 duration-300"
            >
              {activeTab === "profile" && (
                <ProfileSection profile={profile} onUpdate={fetchProfile} />
              )}
              {activeTab === "admin" && profile?.isAdmin && (
                <AdminSection currentUserId={profile.id} />
              )}
              {activeTab === "shopify" && <ShopifySection />}
              {activeTab === "preferences" && <PreferencesSection />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 rounded" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="h-4 w-48 rounded" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="space-y-3 mt-6">
          <div className="h-10 rounded" style={{ backgroundColor: "var(--card-border)" }} />
          <div className="h-10 rounded" style={{ backgroundColor: "var(--card-border)" }} />
        </div>
      </div>
    </Card>
  );
}

// ============================================
// PROFILE SECTION
// ============================================
function ProfileSection({
  profile,
  onUpdate,
}: {
  profile: UserProfile | null;
  onUpdate: () => void;
}) {
  const [name, setName] = useState(profile?.name || "");
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile]);

  async function handleSaveName() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        showToast("Profile updated", "success");
        onUpdate();
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Profile
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your personal information and security
        </p>
      </div>

      {/* Profile Info Card */}
      <Card className="overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{
            backgroundColor: "var(--weld-light)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--walnut-light)" }}
            >
              <UserCircle className="w-8 h-8" style={{ color: "var(--walnut)" }} />
            </div>
            <div>
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                {profile?.name || profile?.email?.split("@")[0]}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {profile?.email}
              </p>
            </div>
            {profile?.isAdmin && (
              <span
                className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: "var(--indigo-light)",
                  color: "var(--indigo)",
                }}
              >
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <User className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              Display Name
            </label>
            <div className="flex gap-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1"
              />
              <Button
                onClick={handleSaveName}
                disabled={saving || name === profile?.name}
                size="md"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Mail className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              Email Address
            </label>
            <Input value={profile?.email || ""} disabled className="opacity-60" />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Email cannot be changed
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px"
            style={{ backgroundColor: "var(--card-border)" }}
          />

          {/* Password Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-sm font-medium flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <Lock className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                Password
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </Button>
            </div>

            {showPasswordForm && (
              <PasswordChangeForm onSuccess={() => setShowPasswordForm(false)} />
            )}
          </div>
        </div>
      </Card>

      {/* Account Info */}
      <Card className="p-6">
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Account Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p style={{ color: "var(--text-muted)" }}>Member since</p>
            <p style={{ color: "var(--text-primary)" }}>
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--text-muted)" }}>Account type</p>
            <p style={{ color: "var(--text-primary)" }}>
              {profile?.isAdmin ? "Administrator" : "User"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PasswordChangeForm({ onSuccess }: { onSuccess: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        showToast("Password changed successfully", "success");
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to change password");
      }
    } catch {
      setError("Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="space-y-2">
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Current Password
        </label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          New Password
        </label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Confirm New Password
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-sm flex items-center gap-2" style={{ color: "var(--danger)" }}>
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : null}
        {saving ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
}

// ============================================
// ADMIN SECTION
// ============================================
function AdminSection({ currentUserId }: { currentUserId: string }) {
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [emailsRes, usersRes] = await Promise.all([
        fetch("/api/admin/allowed-emails"),
        fetch("/api/admin/users"),
      ]);

      if (emailsRes.ok) {
        const data = await emailsRes.json();
        setAllowedEmails(data.data || []);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setAdding(true);
    try {
      const res = await fetch("/api/admin/allowed-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.toLowerCase().trim() }),
      });

      if (res.ok) {
        showToast("Email added", "success");
        setNewEmail("");
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to add email", "error");
      }
    } catch {
      showToast("Failed to add email", "error");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemoveEmail(email: string) {
    try {
      const res = await fetch(`/api/admin/allowed-emails/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Email removed", "success");
        fetchData();
      } else {
        showToast("Failed to remove email", "error");
      }
    } catch {
      showToast("Failed to remove email", "error");
    }
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Admin Controls
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage user access and permissions
        </p>
      </div>

      {/* Allowed Emails */}
      <Card className="overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{
            backgroundColor: "var(--indigo-light)",
            borderColor: "var(--card-border)",
          }}
        >
          <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>
            Allowed Emails
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Only these emails can register for an account
          </p>
        </div>

        <div className="p-6">
          {/* Add new email form */}
          <form onSubmit={handleAddEmail} className="flex gap-3 mb-6">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="email@example.com"
              className="flex-1"
            />
            <Button type="submit" disabled={adding || !newEmail.trim()}>
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span className="ml-2">Add</span>
            </Button>
          </form>

          {/* Email list */}
          <div className="space-y-2">
            {allowedEmails.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
                No allowed emails configured
              </p>
            ) : (
              allowedEmails.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                      {item.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(item.email)}
                    className="opacity-50 hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: "var(--danger)" }} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Registered Users */}
      <Card className="overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{
            backgroundColor: "var(--walnut-light)",
            borderColor: "var(--card-border)",
          }}
        >
          <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>
            Registered Users
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {users.length} user{users.length !== 1 ? "s" : ""} registered
          </p>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
          {users.map((user) => (
            <div
              key={user.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: user.isAdmin
                      ? "var(--indigo-light)"
                      : "var(--walnut-light)",
                    color: user.isAdmin ? "var(--indigo)" : "var(--walnut)",
                  }}
                >
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {user.name || user.email.split("@")[0]}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user.isAdmin && (
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: "var(--indigo-light)",
                      color: "var(--indigo)",
                    }}
                  >
                    Admin
                  </span>
                )}
                {user.id === currentUserId && (
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: "var(--weld-light)",
                      color: "var(--walnut)",
                    }}
                  >
                    You
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// SHOPIFY SECTION
// ============================================
function ShopifySection() {
  const [status, setStatus] = useState<ShopifyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/shopify/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch Shopify status:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/shopify/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        showToast(`Synced ${data.count || 0} products`, "success");
        fetchStatus();
      } else {
        showToast("Sync failed", "error");
      }
    } catch {
      showToast("Sync failed", "error");
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Shopify Connection
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your store connection and product sync
        </p>
      </div>

      {/* Connection Status Card */}
      <Card className="overflow-hidden">
        <div
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{
            backgroundColor: status?.connected
              ? "var(--success-light)"
              : "var(--danger-light)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: status?.connected
                  ? "var(--success)"
                  : "var(--danger)",
              }}
            >
              {status?.connected ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <AlertCircle className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                {status?.connected ? "Connected" : "Not Connected"}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {status?.storeUrl || "No store configured"}
              </p>
            </div>
          </div>

          <Button
            onClick={handleSync}
            disabled={syncing || !status?.connected}
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                Products Synced
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {status?.productCount?.toLocaleString() || 0}
              </p>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                Last Sync
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {status?.lastSyncAt
                  ? new Date(status.lastSyncAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Store Info */}
      <Card className="p-6">
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Store Information
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "var(--text-muted)" }}>Store URL</span>
            <span style={{ color: "var(--text-primary)" }}>
              {status?.storeUrl || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-muted)" }}>API Scopes</span>
            <span style={{ color: "var(--text-primary)" }}>
              read_products, read_orders, read_analytics
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// PREFERENCES SECTION
// ============================================
function PreferencesSection() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Preferences
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Customize your experience
        </p>
      </div>

      <Card className="p-6">
        <div className="text-center py-8">
          <Palette
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "var(--text-muted)" }}
          />
          <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>
            Preferences Coming Soon
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Theme customization and default settings will be available in a future
            update.
          </p>
        </div>
      </Card>
    </div>
  );
}
