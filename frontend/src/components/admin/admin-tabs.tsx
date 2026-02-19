"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { AdminTab } from "@/types/admin";

const TABS: AdminTab[] = ["users"];

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const t = useTranslations("admin");

  return (
    <div className="flex gap-0 border-b bg-background px-6">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors",
            tab === activeTab
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(`tabs.${tab}`)}
        </button>
      ))}
    </div>
  );
}
