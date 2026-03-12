import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types/pagination.types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        disabled={!meta.hasPreviousPage}
        onClick={() => onPageChange(meta.page - 1)}
        className="p-2 rounded-lg border border-[var(--color-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
        .filter((p) => {
          // Mostra apenas páginas próximas do page atual
          return (
            p === 1 || p === meta.totalPages || Math.abs(p - meta.page) <= 1
          );
        })
        .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
          if (i > 0) {
            const prev = arr[i - 1];
            if (p - prev > 1) acc.push("ellipsis");
          }
          acc.push(p);
          return acc;
        }, [])
        .map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-[var(--color-text-muted)]"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                item === meta.page
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-[var(--color-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
              }`}
            >
              {item}
            </button>
          ),
        )}

      <button
        disabled={!meta.hasNextPage}
        onClick={() => onPageChange(meta.page + 1)}
        className="p-2 rounded-lg border border-[var(--color-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
