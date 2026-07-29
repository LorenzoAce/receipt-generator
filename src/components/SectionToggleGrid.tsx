import { LayoutPanelTop } from "lucide-react";
import { SECTION_LABELS, type ReceiptDraft, type ReceiptSectionKey } from "../utils/receipt";
import { CollapsibleCard } from "./CollapsibleCard";

type SectionToggleGridProps = {
  draft: ReceiptDraft;
  onToggle: (section: ReceiptSectionKey) => void;
};

export function SectionToggleGrid({ draft, onToggle }: SectionToggleGridProps) {
  return (
    <CollapsibleCard title="Sezioni visibili" icon={LayoutPanelTop}>
      <div className="grid grid-cols-2 gap-3">
        {SECTION_LABELS.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => onToggle(section.key)}
            className={`rounded-[20px] border px-4 py-3 text-left text-sm transition ${
              draft.sections[section.key]
                ? "border-amber-300 bg-amber-50 text-stone-800"
                : "border-stone-200 bg-stone-50 text-stone-500 hover:bg-white hover:text-stone-700"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </CollapsibleCard>
  );
}
