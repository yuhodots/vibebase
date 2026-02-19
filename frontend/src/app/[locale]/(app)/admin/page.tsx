"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { AdminUsersPanel } from "@/components/admin/admin-users-panel";
import { fetchDashboardStats } from "@/lib/api/admin";
import type { AdminDashboardStats, AdminTab } from "@/types/admin";

export default function AdminPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const { isAdmin, isLoading, backendToken } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAdmin, router]);

  useEffect(() => {
    if (!backendToken) return;
    fetchDashboardStats(backendToken).then((res) => {
      if (res.success && res.data) setStats(res.data);
    });
  }, [backendToken]);

  if (isLoading || !isAdmin) return null;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* Header */}
      <header className="px-6 py-4 shrink-0 border-b bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          {stats && (
            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted font-medium">
                {t("stats.totalUsers")} {stats.totalUsers}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Tab navigation */}
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 bg-muted/30">
        {backendToken && activeTab === "users" && (
          <AdminUsersPanel token={backendToken} />
        )}
      </main>
    </div>
  );
}
