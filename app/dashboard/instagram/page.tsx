"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Sparkles, Clock, Image as ImageIcon, Calendar } from "lucide-react";
import Link from "next/link";

export default function InstagramPage() {
  return (
    <>
      <Header
        title="Instagram Content Creator"
        description="Create, schedule, and analyze your Instagram posts"
      />

      <div className="p-6" style={{ backgroundColor: "var(--background)" }}>
        {/* Coming Soon Hero */}
        <Card className="overflow-hidden">
          <div
            className="relative px-8 py-16 text-center"
            style={{
              background: "linear-gradient(135deg, var(--indigo-light) 0%, var(--madder-light) 100%)",
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute top-4 right-8 w-24 h-24 rounded-full opacity-20"
              style={{ backgroundColor: "var(--indigo)" }}
            />
            <div
              className="absolute bottom-4 left-8 w-16 h-16 rounded-full opacity-20"
              style={{ backgroundColor: "var(--madder)" }}
            />

            <div className="relative z-10">
              <div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--indigo)", boxShadow: "0 8px 32px rgba(61, 90, 128, 0.3)" }}
              >
                <Instagram className="h-10 w-10 text-white" />
              </div>

              <h2
                className="text-3xl font-bold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Coming Soon
              </h2>

              <p
                className="text-lg max-w-xl mx-auto mb-8"
                style={{ color: "var(--text-secondary)" }}
              >
                We&apos;re building a powerful Instagram content creator with AI-powered captions,
                optimal posting times, and direct scheduling.
              </p>

              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Feature Preview */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--weld-light)" }}
              >
                <Sparkles className="h-6 w-6" style={{ color: "var(--weld)" }} />
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                AI Captions
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Generate engaging captions in your artisan voice with relevant hashtags
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--indigo-light)" }}
              >
                <Clock className="h-6 w-6" style={{ color: "var(--indigo)" }} />
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Optimal Timing
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Post when your audience is most active based on analytics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--madder-light)" }}
              >
                <Calendar className="h-6 w-6" style={{ color: "var(--madder)" }} />
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Schedule Posts
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Plan your content calendar and schedule posts in advance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notify Interest */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--success-light)" }}
                >
                  <ImageIcon className="h-6 w-6" style={{ color: "var(--success)" }} />
                </div>
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Want to be notified when this launches?
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Instagram integration is currently in development
                  </p>
                </div>
              </div>
              <Button variant="outline" size="md" disabled>
                Notify Me
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
