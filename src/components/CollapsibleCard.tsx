import { useState, type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

type CollapsibleCardProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  headerLeading?: ReactNode;
  headerActions?: ReactNode;
};

export function CollapsibleCard({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  contentClassName,
  headerLeading,
  headerActions,
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800",
          isOpen && "bg-slate-50/70 dark:bg-slate-800/60",
          headerClassName,
        )}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
        >
          <div className="flex min-w-0 items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
            {headerLeading}
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
              <Icon className="h-4 w-4" />
            </span>
            <span className="truncate font-semibold text-slate-800 dark:text-slate-100">{title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {headerActions && (
          <div className="flex shrink-0 items-center gap-2">
            {headerActions}
          </div>
        )}
      </div>

      {isOpen && <div className={cn("px-5 pb-5 pt-5", contentClassName)}>{children}</div>}
    </section>
  );
}
