import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

type TopBarProps = {
  onMenuAction: (action: "archive") => void;
};

export function TopBar({
  onMenuAction,
}: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="no-print sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-1 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-950">
              <img src="/logo.png" alt="Receipt Generator" className="h-full w-full object-cover" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Receipt Generator</div>
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300">
                  1.0
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Builder professionale per ricevute termiche</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-500/60 dark:hover:bg-slate-800"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-4 w-4" />
              Menu
              <ChevronDown className={cn("h-4 w-4 text-slate-400 transition duration-200 dark:text-slate-500", isMenuOpen && "rotate-180")} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 min-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_50px_rgba(2,6,23,0.55)]">
                <button
                  type="button"
                  onClick={() => {
                    onMenuAction("archive");
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition duration-200 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                >
                  Archivio
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-500/60 dark:hover:bg-slate-800"
            aria-label={isDark ? "Attiva tema chiaro" : "Attiva tema scuro"}
            title={isDark ? "Tema chiaro" : "Tema dark"}
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
