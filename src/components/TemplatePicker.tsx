import { Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { CollapsibleCard } from "./CollapsibleCard";
import { receiptTemplates } from "../utils/receipt";

type TemplatePickerProps = {
  activeTemplateId: string;
  onApplyTemplate: (templateId: string) => void;
};

export function TemplatePicker({ activeTemplateId, onApplyTemplate }: TemplatePickerProps) {
  return (
    <CollapsibleCard title="Template rapidi" icon={Sparkles}>
      <div className="grid gap-3">
        {receiptTemplates.map((template) => {
          const isActive = template.id === activeTemplateId;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onApplyTemplate(template.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition duration-200",
                isActive
                  ? "border-blue-200 bg-blue-50/70 shadow-[0_12px_28px_rgba(37,99,235,0.10)] dark:border-blue-500/50 dark:bg-blue-500/10"
                  : "border-slate-200 bg-slate-50/70 hover:-translate-y-0.5 hover:border-blue-100 hover:bg-white hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-800/70 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:shadow-[0_18px_40px_rgba(2,6,23,0.35)]",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{template.name}</span>
                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  {template.draft.paperWidth}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{template.description}</p>
            </button>
          );
        })}
      </div>
    </CollapsibleCard>
  );
}
