import { Palette, SlidersHorizontal } from "lucide-react";
import {
  CURRENCY_DISPLAY_OPTIONS,
  PREVIEW_FONT_OPTIONS,
  THERMAL_INTENSITY_OPTIONS,
  type ReceiptDraft,
  type ReceiptLayout,
} from "../utils/receipt";
import { CollapsibleCard } from "./CollapsibleCard";

type ReceiptControlsPanelProps = {
  draft: ReceiptDraft;
  onUpdateDraft: <K extends keyof ReceiptDraft>(field: K, value: ReceiptDraft[K]) => void;
  onUpdateLayout: <K extends keyof ReceiptLayout>(field: K, value: ReceiptLayout[K]) => void;
};

export function ReceiptControlsPanel({
  draft,
  onUpdateDraft,
  onUpdateLayout,
}: ReceiptControlsPanelProps) {
  return (
    <CollapsibleCard title="Impostazioni" icon={SlidersHorizontal} contentClassName="space-y-5 px-5 pb-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/60">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <Palette className="h-4 w-4 text-blue-600" />
          Stile ricevuta
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Valuta</span>
            <select
              value={draft.currency}
              onChange={(event) => onUpdateDraft("currency", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500/20"
            >
              <option value="EUR">EUR - EUR</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Formato</span>
            <div className="grid grid-cols-2 gap-2">
              {CURRENCY_DISPLAY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onUpdateLayout("currencyDisplay", option.value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition duration-200 ${
                    draft.layout.currencyDisplay === option.value
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Font</span>
            <div className="grid grid-cols-2 gap-2">
              {PREVIEW_FONT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onUpdateLayout("previewFont", option.value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition duration-200 ${
                    draft.layout.previewFont === option.value
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Colore testo</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="color"
                value={draft.layout.textColor}
                onChange={(event) => onUpdateLayout("textColor", event.target.value)}
                className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              <span className="text-sm text-slate-600">{draft.layout.textColor.toUpperCase()}</span>
            </div>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Effetto stampa termica</span>
            <button
              type="button"
              onClick={() => onUpdateLayout("thermalEffect", !draft.layout.thermalEffect)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition duration-200 ${
                draft.layout.thermalEffect
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <span>Imperfezioni inchiostro</span>
              <span className="rounded-lg bg-white px-3 py-1 text-xs uppercase tracking-[0.16em]">
                {draft.layout.thermalEffect ? "Attivo" : "Off"}
              </span>
            </button>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Intensita</span>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
              {THERMAL_INTENSITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onUpdateLayout("thermalIntensity", option.value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition duration-200 ${
                    draft.layout.thermalIntensity === option.value
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{`Opacita testo ${draft.layout.textOpacity}%`}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={draft.layout.textOpacity}
              onChange={(event) => onUpdateLayout("textOpacity", Number.parseInt(event.target.value, 10))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
            />
          </label>

        </div>
      </div>
    </CollapsibleCard>
  );
}
