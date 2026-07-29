import { Package2, Plus, Trash2 } from "lucide-react";
import { calculateLineTotal, formatCurrency, type ReceiptDraft, type ReceiptItem } from "../utils/receipt";
import { CollapsibleCard } from "./CollapsibleCard";

type ItemsEditorProps = {
  draft: ReceiptDraft;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: <K extends keyof ReceiptItem>(id: string, field: K, value: ReceiptItem[K]) => void;
};

type NumericField = "quantity" | "unitPrice" | "discount" | "vatRate";

export function ItemsEditor({ draft, onAddItem, onRemoveItem, onUpdateItem }: ItemsEditorProps) {
  return (
    <CollapsibleCard title="Articoli" icon={Package2} contentClassName="space-y-4 px-5 pb-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="mt-1 text-sm text-stone-600">Gestisci quantita, IVA e sconti riga per riga.</p>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-700 transition hover:bg-amber-100"
        >
          <Plus className="h-4 w-4" />
          Aggiungi
        </button>
      </div>

      <div className="space-y-4">
        {draft.items.map((item, index) => (
          <article key={item.id} className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-stone-800">Riga {index + 1}</span>
              {draft.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-500 transition hover:border-red-200 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Rimuovi
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Descrizione</span>
                <input
                  value={item.description}
                  onChange={(event) => onUpdateItem(item.id, "description", event.target.value)}
                  className="w-full rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </label>

              {([
                ["quantity", "Qta"],
                ["unitPrice", "Prezzo"],
                ["discount", "Sconto"],
                ["vatRate", "IVA %"],
              ] as Array<[NumericField, string]>).map(([field, label]) => (
                <label key={field} className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                  <input
                    type="number"
                    min="0"
                    step={field === "quantity" ? "1" : "0.01"}
                    value={item[field]}
                    onChange={(event) =>
                      onUpdateItem(item.id, field, Number.parseFloat(event.target.value || "0"))
                    }
                    className="w-full rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600">
              Totale riga: {formatCurrency(calculateLineTotal(item), draft.currency)}
            </div>
          </article>
        ))}
      </div>
    </CollapsibleCard>
  );
}
