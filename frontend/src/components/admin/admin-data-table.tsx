"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

// ── Skeleton rows ───────────────────────────────────────────

function SkeletonRows({ colCount, rows = 3 }: { colCount: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b">
          {Array.from({ length: colCount }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-3">
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Component ───────────────────────────────────────────────

export function AdminDataTable<T>({
  columns,
  data,
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
  isLoading = false,
  emptyMessage,
  onRowClick,
  actions,
}: AdminDataTableProps<T>) {
  const t = useTranslations("admin.common");

  const totalPages = useMemo(
    () => (limit > 0 ? Math.ceil(total / limit) : 1),
    [total, limit],
  );

  const showPagination = total > limit;
  const totalColCount = columns.length + (actions ? 1 : 0);

  function getCellContent(item: T, column: Column<T>): React.ReactNode {
    if (column.render) {
      return column.render(item);
    }
    const value = (item as Record<string, unknown>)[column.key];
    if (value === null || value === undefined) return "-";
    return String(value);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2.5 text-left font-medium text-muted-foreground",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                  {t("edit")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading && <SkeletonRows colCount={totalColCount} />}

            {!isLoading && data.length === 0 && (
              <tr>
                <td
                  colSpan={totalColCount}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage ?? t("noResults")}
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/30",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-2.5", col.className)}>
                      {getCellContent(item, col)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-2.5 text-right">{actions(item)}</td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between border-t px-4 py-3 shrink-0 bg-background">
          <span className="text-sm text-muted-foreground">
            {t("page")} {page} {t("of")} {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
