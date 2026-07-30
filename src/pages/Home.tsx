import { Download, Printer, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReceiptArchivePanel } from "../components/ReceiptArchivePanel";
import { ReceiptControlsPanel } from "../components/ReceiptControlsPanel";
import { ReceiptPreview } from "../components/ReceiptPreview";
import { SectionsBuilder } from "../components/SectionsBuilder";
import { TemplatePicker } from "../components/TemplatePicker";
import { TopBar } from "../components/TopBar";
import { cn } from "../lib/utils";
import { useReceiptStore } from "../store/useReceiptStore";
import { exportReceiptPdf } from "../utils/pdf";

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const {
    draft,
    replaceDraft,
    setPaperWidth,
    updateDraft,
    updateLayout,
    addBuilderSection,
    removeBuilderSection,
    moveBuilderSection,
    updateFreeTextBlock,
    addItem,
    updateItem,
    removeItem,
    applyTemplate,
    resetDraft,
  } = useReceiptStore();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    exportReceiptPdf(draft);
  };

  const handleScrollToMenu = () => {
    controlsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleMenuAction = (action: "archive") => {
    if (action === "archive") {
      setIsArchiveOpen(true);
    }
  };

  useEffect(() => {
    document.title = "Receipt Generator";
  }, []);

  return (
    <main className="app-shell min-h-screen px-4 py-5 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-10 lg:py-8">
      <div className="app-shell-inner mx-auto max-w-[1720px]">
        <div className="app-dashboard relative">
        <TopBar
          onMenuAction={handleMenuAction}
        />

        <section className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(420px,0.9fr)] xl:grid-cols-[minmax(0,1.72fr)_minmax(460px,0.88fr)]">
          <div ref={controlsRef} className="no-print space-y-5">
            <TemplatePicker activeTemplateId={draft.templateId} onApplyTemplate={applyTemplate} />
            <ReceiptControlsPanel draft={draft} onUpdateDraft={updateDraft} onUpdateLayout={updateLayout} />
            <SectionsBuilder
              draft={draft}
              onUpdateDraft={updateDraft}
              onAddSection={addBuilderSection}
              onRemoveSection={removeBuilderSection}
              onMoveSection={moveBuilderSection}
              onUpdateFreeTextBlock={updateFreeTextBlock}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
          </div>

          <div className="preview-column space-y-5 lg:mx-auto lg:w-full lg:max-w-[640px]">
            <div className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Anteprima</span>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                    {(["80mm", "62mm"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaperWidth(mode)}
                        className={cn(
                          "rounded-lg px-4 py-2 text-sm font-medium transition duration-200",
                          draft.paperWidth === mode
                            ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.24)]"
                            : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100",
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] transition duration-200 hover:-translate-y-px hover:bg-blue-700"
                  >
                    <Printer className="h-4 w-4" />
                    Stampa
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 transition duration-200 hover:-translate-y-px hover:border-violet-300 hover:bg-violet-100"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition duration-200 hover:-translate-y-px hover:border-rose-300 hover:bg-rose-100"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
            <ReceiptPreview ref={previewRef} draft={draft} onMoveSection={moveBuilderSection} />
          </div>
        </section>
        </div>
      </div>

      {isArchiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.45)] px-4 py-6 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Chiudi archivio"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsArchiveOpen(false)}
          />
          <div className="relative z-10 w-full max-w-3xl">
            <ReceiptArchivePanel draft={draft} onApplyDraft={replaceDraft} />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsArchiveOpen(false)}
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/60 dark:hover:bg-slate-800"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
