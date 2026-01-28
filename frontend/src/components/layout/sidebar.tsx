"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "@/i18n";
import {
  LayoutDashboard,
  Home,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Monitor,
  Globe,
  Check,
  LogOut,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface NavItem {
  href: string;
  icon: LucideIcon;
  labelKey: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", icon: Home, labelKey: "home" },
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
];

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  label: string;
}

function NavLink({ item, isActive, label }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[15px] font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function useActivePath() {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, "") || "/";

  return (href: string) =>
    href === "/" ? pathWithoutLocale === "/" : pathWithoutLocale.startsWith(href);
}

function useOutsideClick(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return ref;
}

export function Sidebar() {
  const t = useTranslations("nav");
  const tSettings = useTranslations("settings");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isActive = useActivePath();
  const { user, isAuthenticated, signOut } = useAuth();

  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useOutsideClick(() => setShowSettings(false));

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, "") || "/";
    router.replace(pathWithoutLocale, { locale: newLocale });
  };

  const themeOptions = [
    { value: "light", label: tSettings("light"), icon: Sun },
    { value: "dark", label: tSettings("dark"), icon: Moon },
    { value: "system", label: tSettings("system"), icon: Monitor },
  ];

  const languageOptions = [
    { value: "ko", label: "한국어" },
    { value: "en", label: "English" },
  ];

  return (
    <aside className="w-[220px] h-screen bg-card border-r flex flex-col py-5 px-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-2 mb-8">
        <span className="font-semibold text-lg">Vibebase</span>
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            label={t(item.labelKey)}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 pt-4 border-t relative">
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[15px] font-medium transition-colors",
            showSettings
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span>{t("settings")}</span>
        </button>

        {/* Settings Popup */}
        {showSettings && (
          <div
            ref={settingsRef}
            className="absolute bottom-full left-0 right-0 mb-2 bg-card border rounded-xl shadow-lg overflow-hidden z-50"
          >
            <div className="p-3 border-b">
              <p className="text-sm font-medium text-muted-foreground">
                {tSettings("title")}
              </p>
            </div>

            {/* Theme */}
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                {tSettings("theme")}
              </p>
              <div className="space-y-0.5">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{option.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language */}
            <div className="p-2 border-t">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                {tSettings("language")}
              </p>
              <div className="space-y-0.5">
                {languageOptions.map((option) => {
                  const isSelected = locale === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleLanguageChange(option.value)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Globe className="h-4 w-4" />
                      <span className="flex-1 text-left">{option.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Help Link */}
        <Link
          href="/help"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[15px] font-medium transition-colors",
            isActive("/help")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          <span>{t("help")}</span>
        </Link>

        {/* User Section */}
        {isAuthenticated && user && (
          <div className="pt-3 mt-3 border-t">
            <div className="flex items-center gap-2.5 px-3 py-2">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[15px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>{tAuth("signOut")}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
