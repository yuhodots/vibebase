"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { Trash2, ShieldCheck, ShieldOff, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDataTable, type Column } from "./admin-data-table";
import { fetchUsers, updateUserRole, deleteUser } from "@/lib/api/admin";
import type { AdminUser } from "@/types/admin";

interface AdminUsersPanelProps {
  token: string;
}

export function AdminUsersPanel({ token }: AdminUsersPanelProps) {
  const t = useTranslations("admin");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [search]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchUsers(
        { search: debouncedSearch || undefined, role: roleFilter, page, limit: 20 },
        token,
      );
      if (res.success && res.data) {
        setUsers(res.data.items);
        setTotal(res.data.total);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, roleFilter, page, token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChangeConfirm = async () => {
    if (!roleTarget) return;
    const newRole = roleTarget.role === "admin" ? "user" : "admin";
    try {
      await updateUserRole(roleTarget.id, { role: newRole as "user" | "admin" }, token);
      toast.success(t("users.changeRole"));
      setRoleTarget(null);
      loadUsers();
    } catch {
      toast.error("Failed to change role");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id, token);
      toast.success(t("users.deleteUser"));
      setDeleteTarget(null);
      loadUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const columns: Column<AdminUser>[] = useMemo(
    () => [
      {
        key: "name",
        header: t("users.name"),
        render: (u) => (
          <div className="flex items-center gap-2">
            {u.image ? (
              <img src={u.image} alt={u.name} className="h-6 w-6 rounded-full" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {u.name.charAt(0)}
              </div>
            )}
            <span>{u.name}</span>
          </div>
        ),
      },
      { key: "email", header: t("users.email") },
      {
        key: "provider",
        header: t("users.provider"),
        className: "w-24",
        render: (u) => u.provider.charAt(0).toUpperCase() + u.provider.slice(1),
      },
      {
        key: "role",
        header: t("users.role"),
        className: "w-20",
        render: (u) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              u.role === "admin"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {u.role}
          </span>
        ),
      },
      {
        key: "createdAt",
        header: t("users.created"),
        className: "w-28",
        render: (u) => new Date(u.createdAt).toLocaleDateString(),
      },
      {
        key: "status",
        header: t("users.status"),
        className: "w-20",
        render: (u) =>
          u.deletedAt ? (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {t("users.deleted")}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {t("users.active")}
            </span>
          ),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 shrink-0 bg-background border-b">
        <Input
          placeholder={t("users.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={roleFilter ?? ""}
          onChange={(e) => {
            setRoleFilter(e.target.value || undefined);
            setPage(1);
          }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <AdminDataTable<AdminUser>
        columns={columns}
        data={users}
        total={total}
        page={page}
        limit={20}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t("users.noUsers")}
        actions={(user) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setRoleTarget(user)}
              title={user.role === "admin" ? "Make User" : "Make Admin"}
            >
              {user.role === "admin" ? (
                <ShieldOff className="h-3.5 w-3.5" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
            </Button>
            {!user.deletedAt && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(user)}
                aria-label={t("users.deleteUser")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      />

      {/* Role Change Confirm Modal */}
      {roleTarget && (
        <RoleChangeModal
          user={roleTarget}
          onConfirm={handleRoleChangeConfirm}
          onClose={() => setRoleTarget(null)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ── Role Change Confirmation Modal ────────────────────────

function RoleChangeModal({
  user,
  onConfirm,
  onClose,
}: {
  user: AdminUser;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("admin");
  const [saving, setSaving] = useState(false);
  const newRole = user.role === "admin" ? "user" : "admin";

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirm();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-background shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{t("users.changeRole")}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("users.changeRoleConfirm")}
          </p>

          <div className="flex items-center justify-center gap-3">
            <RoleBadge role={user.role} />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <RoleBadge role={newRole} />
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {user.name} ({user.email})
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={saving}>
            {saving ? t("common.loading") : t("common.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Delete User Confirmation Modal ────────────────────────

function DeleteUserModal({
  user,
  onConfirm,
  onClose,
}: {
  user: AdminUser;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("admin");
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirm();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-background shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-destructive">{t("users.deleteUser")}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("users.deleteConfirm")}
          </p>

          <div className="text-center space-y-1">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={saving}>
            {saving ? t("common.loading") : t("common.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Role Badge ────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
        role === "admin"
          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      {role}
    </span>
  );
}
