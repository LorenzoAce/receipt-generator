import { forwardRef, useState, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/utils";
import {
  BUILDER_SECTION_OPTIONS,
  PAPER_SPECS,
  buildSectionSeparatorLine,
  buildQrCodeImageUrl,
  calculateLineTotal,
  calculateSummary,
  formatCurrencyForPreview,
  getPreviewFontFamily,
  getThermalIntensityBoost,
  getVatBreakdown,
  type BuilderSectionType,
  type ReceiptDraft,
} from "../utils/receipt";

type ReceiptPreviewProps = {
  draft: ReceiptDraft;
  onMoveSection?: (draggedSection: BuilderSectionType, targetSection: BuilderSectionType) => void;
};

export const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(function ReceiptPreview(
  { draft, onMoveSection },
  ref,
) {
  const paperSpec = PAPER_SPECS[draft.paperWidth];
  const summary = calculateSummary(draft);
  const compact = draft.layout.density === "compact";
  const previewFontFamily = getPreviewFontFamily(draft.layout.previewFont);
  const textOpacity = draft.layout.textOpacity / 100;
  const thermalBoost = draft.layout.thermalEffect ? getThermalIntensityBoost(draft.layout.thermalIntensity) : 0;
  const vatBreakdown = getVatBreakdown(draft.items);
  const previewSeparatorColumns = paperSpec.columns;
  const hasVisibleSections = draft.builderSections.length > 0;
  const qrCodeImageUrl = draft.barcodeType === "qr-link" ? buildQrCodeImageUrl(draft.barcodeLink, draft.qrSize) : "";
  const qrBorderRadius = draft.qrShape === "rounded" ? "22px" : draft.qrShape === "soft" ? "34px" : "0px";
  const canReorderInPreview = typeof onMoveSection === "function" && draft.builderSections.length > 1;
  const [draggedSection, setDraggedSection] = useState<BuilderSectionType | null>(null);
  const [dropTargetSection, setDropTargetSection] = useState<BuilderSectionType | null>(null);

  const sectionLabels = Object.fromEntries(
    BUILDER_SECTION_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<BuilderSectionType, string>;

  const handleDragStart = (section: BuilderSectionType) => {
    if (!canReorderInPreview) {
      return;
    }

    setDraggedSection(section);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, section: BuilderSectionType) => {
    if (!canReorderInPreview || draggedSection === null) {
      return;
    }

    event.preventDefault();

    if (section !== draggedSection) {
      setDropTargetSection(section);
    }
  };

  const handleDrop = (targetSection: BuilderSectionType) => {
    if (!canReorderInPreview || !onMoveSection || draggedSection === null) {
      return;
    }

    if (draggedSection !== targetSection) {
      onMoveSection(draggedSection, targetSection);
    }

    setDraggedSection(null);
    setDropTargetSection(null);
  };

  const resetDragState = () => {
    setDraggedSection(null);
    setDropTargetSection(null);
  };

  const renderSectionSeparator = (section: BuilderSectionType, className = "mt-3") => {
    const separator = buildSectionSeparatorLine(draft.sectionSeparators[section], previewSeparatorColumns);

    if (separator === null) {
      return null;
    }

    if (separator === "") {
      return <div className={cn(className, "h-4 w-full")} />;
    }

    return (
      <div className={cn(className, "w-full overflow-hidden")}>
        <p className="w-full text-center text-[11px] leading-none text-slate-400 whitespace-nowrap">{separator}</p>
      </div>
    );
  };

  const renderSectionContent = (section: BuilderSectionType): ReactNode => {
    if (section === "header") {
      return (
        <div className={cn("space-y-1", draft.layout.headerAlignment === "center" && "text-center")}>
          {draft.logoImageUrl && (
            <div
              className={cn(
                "mb-3 flex",
                draft.logoAlignment === "center" && "justify-center",
                draft.logoAlignment === "right" && "justify-end",
              )}
            >
              <img
                src={draft.logoImageUrl}
                alt="Logo intestazione"
                className="object-contain"
                style={{
                  width: `${draft.logoSize}px`,
                  maxHeight: `${Math.max(draft.logoSize * 0.8, 48)}px`,
                  opacity: draft.logoOpacity / 100,
                }}
              />
            </div>
          )}
          <div className="font-['Cormorant_Garamond'] text-[28px] font-semibold uppercase tracking-[0.28em]">
            {draft.logoText}
          </div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{draft.title}</p>
          <div className={cn("space-y-1 pt-2", draft.layout.headerAlignment === "center" && "text-center")}>
            <p className="font-semibold uppercase">{draft.merchantName}</p>
            <p>{draft.merchantAddress}</p>
            <p>{draft.merchantCity}</p>
            {draft.vatNumber && <p>P.IVA {draft.vatNumber}</p>}
            <p>{draft.phone}</p>
          </div>
          {renderSectionSeparator("header", "pt-2")}
        </div>
      );
    }

    if (section === "datetime") {
      return (
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between gap-4">
            <span>Ricevuta</span>
            <span>{draft.receiptNumber}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Data</span>
            <span>{draft.issueDate}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Ora</span>
            <span>{draft.issueTime}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Cassa</span>
            <span>{draft.cashier}</span>
          </div>
          {renderSectionSeparator("datetime")}
        </div>
      );
    }

    if (section === "columns") {
      return (
        <div>
          <div className="flex justify-between text-[11px] uppercase tracking-[0.14em] text-slate-500">
            <span>{draft.columnsLeftLabel}</span>
            <span>{draft.columnsRightLabel}</span>
          </div>
          {renderSectionSeparator("columns", "mt-2")}
        </div>
      );
    }

    if (section === "line-items") {
      return (
        <div>
          <div className="space-y-3">
            {draft.items.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="break-words font-medium">{item.description}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} x{" "}
                      {formatCurrencyForPreview(item.unitPrice, draft.currency, draft.layout.currencyDisplay)} · IVA{" "}
                      {item.vatRate}%
                    </p>
                  </div>
                  <span className="shrink-0">
                    {formatCurrencyForPreview(calculateLineTotal(item), draft.currency, draft.layout.currencyDisplay)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {renderSectionSeparator("line-items")}
        </div>
      );
    }

    if (section === "vat-details") {
      return (
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Dettagli IVA</p>
          {vatBreakdown.map((row) => (
            <div key={row.rate} className="space-y-1 text-[11px]">
              <div className="flex justify-between gap-4">
                <span>Aliquota {row.rate}%</span>
                <span>{formatCurrencyForPreview(row.taxable, draft.currency, draft.layout.currencyDisplay)}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-500">
                <span>Imposta</span>
                <span>{formatCurrencyForPreview(row.vat, draft.currency, draft.layout.currencyDisplay)}</span>
              </div>
            </div>
          ))}
          {renderSectionSeparator("vat-details")}
        </div>
      );
    }

    if (section === "payment") {
      return (
        <div className="space-y-2">
          <div className="flex justify-between gap-4">
            <span>Subtotale</span>
            <span>{formatCurrencyForPreview(summary.subtotal, draft.currency, draft.layout.currencyDisplay)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>IVA</span>
            <span>{formatCurrencyForPreview(summary.vatTotal, draft.currency, draft.layout.currencyDisplay)}</span>
          </div>
          {draft.globalDiscount > 0 && (
            <div className="flex justify-between gap-4">
              <span>Sconto extra</span>
              <span>-{formatCurrencyForPreview(draft.globalDiscount, draft.currency, draft.layout.currencyDisplay)}</span>
            </div>
          )}
          {draft.serviceFee > 0 && (
            <div className="flex justify-between gap-4">
              <span>Servizio</span>
              <span>{formatCurrencyForPreview(draft.serviceFee, draft.currency, draft.layout.currencyDisplay)}</span>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-dashed border-stone-300 pt-2 text-[13px] font-semibold uppercase tracking-[0.12em]">
            <span>Totale</span>
            <span>{formatCurrencyForPreview(summary.grandTotal, draft.currency, draft.layout.currencyDisplay)}</span>
          </div>
          <div className="flex justify-between gap-4 pt-1 text-[11px]">
            <span>Pagamento</span>
            <span>{draft.paymentMethod}</span>
          </div>
          {renderSectionSeparator("payment")}
        </div>
      );
    }

    if (section === "custom-message") {
      return (
        <div className="text-[11px]">
          {draft.customMessage && <p className="mt-2 leading-5 text-slate-600">{draft.customMessage}</p>}
          {draft.notes && <p className="mt-2 leading-5 text-slate-600">{draft.notes}</p>}
          {draft.footerMessage && <p className="mt-2 leading-5 text-slate-500">{draft.footerMessage}</p>}
          {renderSectionSeparator("custom-message")}
        </div>
      );
    }

    if (section === "image") {
      if (!draft.imageUrl) {
        return null;
      }

      return (
        <div className={cn("space-y-3", draft.layout.headerAlignment === "center" && "text-center")}>
          <img
            src={draft.imageUrl}
            alt="Sezione immagine"
            className="mx-auto max-h-40 rounded-xl border border-slate-200 object-contain"
          />
          {renderSectionSeparator("image")}
        </div>
      );
    }

    if (section === "barcode") {
      if (draft.barcodeType === "barcode" && draft.barcodeValue) {
        return (
          <div className="text-center text-[11px] text-slate-500">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <div className="h-14 bg-[repeating-linear-gradient(90deg,#1f1713_0,#1f1713_2px,transparent_2px,transparent_4px,#1f1713_4px,#1f1713_5px,transparent_5px,transparent_7px)]" />
              <p className="mt-2 tracking-[0.22em] text-slate-700">{draft.barcodeValue}</p>
              {draft.barcodeCaption && <p className="mt-1 text-slate-500">{draft.barcodeCaption}</p>}
            </div>
            {renderSectionSeparator("barcode")}
          </div>
        );
      }

      if (draft.barcodeType === "qr-link" && qrCodeImageUrl) {
        return (
          <div className="text-center text-[11px] text-slate-500">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <img
                src={qrCodeImageUrl}
                alt="QR code da link"
                className="mx-auto object-contain"
                style={{
                  width: `${draft.qrSize}px`,
                  height: `${draft.qrSize}px`,
                  borderRadius: qrBorderRadius,
                }}
              />
              <p className="mt-2 break-all text-slate-700">{draft.barcodeLink}</p>
              {draft.barcodeCaption && <p className="mt-1 text-slate-500">{draft.barcodeCaption}</p>}
            </div>
            {renderSectionSeparator("barcode")}
          </div>
        );
      }

      return null;
    }

    return null;
  };

  const renderPreviewSection = (section: BuilderSectionType, index: number) => {
    const content = renderSectionContent(section);

    if (!content) {
      return null;
    }

    const label = sectionLabels[section] ?? section;
    const isDragging = draggedSection === section;
    const isDropTarget = dropTargetSection === section && draggedSection !== section;

    return (
      <div
        key={section}
        onDragOver={(event) => handleDragOver(event, section)}
        onDrop={() => handleDrop(section)}
        className={cn(
          index > 0 && (compact ? "mt-3" : "mt-5"),
          "relative transition-all duration-200 ease-out",
          isDragging && "opacity-45",
          isDropTarget && "rounded-xl ring-2 ring-blue-300 ring-offset-2 ring-offset-white",
        )}
        aria-label={`Sezione anteprima ${label}`}
      >
        {canReorderInPreview && (
          <div className="no-print mb-2 flex justify-end">
            <span
              draggable
              onDragStart={() => handleDragStart(section)}
              onDragEnd={resetDragState}
              className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 active:cursor-grabbing"
              aria-label={`Trascina ${label} nell'anteprima`}
              title={`Trascina ${label}`}
            >
              <GripVertical className="h-4 w-4" />
            </span>
          </div>
        )}
        {content}
      </div>
    );
  };

  return (
    <section className="preview-stage relative flex min-h-[840px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_18px_40px_rgba(2,6,23,0.5)]">

      <div
        ref={ref}
        className={cn(
          "printable-ticket relative isolate min-h-[560px] overflow-hidden rounded-none border border-slate-200 bg-white text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
          compact ? "px-5 py-6" : "px-6 py-8",
        )}
        style={
          {
            width: `${paperSpec.widthPx}px`,
            color: draft.layout.textColor,
            "--paper-width-mm": `${paperSpec.widthMm}mm`,
          } as CSSProperties
        }
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.35),transparent_55%)] opacity-70" />
        {draft.layout.thermalEffect && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{
              opacity: 0.2 + thermalBoost,
              backgroundImage:
                "radial-gradient(circle at 15% 22%, rgba(56,38,25,0.12) 0, transparent 22%), radial-gradient(circle at 72% 38%, rgba(56,38,25,0.1) 0, transparent 18%), radial-gradient(circle at 40% 75%, rgba(56,38,25,0.08) 0, transparent 14%)",
            }}
          />
        )}

        <div
          className="relative text-[12px] leading-5"
          style={{
            fontFamily: previewFontFamily,
            opacity: Math.min(textOpacity + thermalBoost * 0.25, 1),
            textShadow: draft.layout.thermalEffect
              ? `0 0 0.2px ${draft.layout.textColor}, 0.35px 0.35px 0 rgba(60,45,34,${Math.min(0.18 + thermalBoost, 0.4)})`
              : "none",
            filter: draft.layout.thermalEffect ? "contrast(1.02) saturate(0.92)" : "none",
          }}
        >
          {!hasVisibleSections && (
            <div className="space-y-5 pt-6">
              <div className="mx-auto h-3 w-28 rounded-full bg-stone-200/50" />
              <div className="space-y-3 opacity-50">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 rounded-full bg-stone-200/70",
                      index % 3 === 0 ? "w-[82%]" : index % 3 === 1 ? "w-[68%]" : "w-[90%]",
                    )}
                  />
                ))}
              </div>
              <div className="pt-6 opacity-45">
                <div className="h-px w-full bg-[linear-gradient(90deg,transparent_0%,rgba(120,96,72,0.45)_12%,rgba(120,96,72,0.45)_88%,transparent_100%)]" />
              </div>
              <div className="space-y-3 opacity-35">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`bottom-${index}`}
                    className={cn(
                      "h-2 rounded-full bg-stone-200/70",
                      index % 2 === 0 ? "w-[74%]" : "w-[88%]",
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {draft.builderSections.map((section, index) => renderPreviewSection(section, index))}
        </div>
      </div>
    </section>
  );
});
