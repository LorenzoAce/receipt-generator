import { forwardRef, useState, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/utils";
import { sanitizeRichTextHtml } from "../utils/richText";
import {
  BUILDER_SECTION_OPTIONS,
  PAPER_SPECS,
  buildSectionSeparatorLine,
  buildQrCodeImageUrl,
  calculateLineTotal,
  calculateSummary,
  formatCurrencyForPreview,
  getFreeTextFontFamily,
  getPreviewFontFamily,
  getThermalIntensityBoost,
  getVatBreakdown,
  type BuilderSectionInstance,
  type BuilderSectionType,
  type ReceiptDraft,
} from "../utils/receipt";

type ReceiptPreviewProps = {
  draft: ReceiptDraft;
  onMoveSection?: (draggedSectionId: string, targetSectionId: string) => void;
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
  const horizontalTicketPadding = compact ? 20 : 24;
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dropTargetSection, setDropTargetSection] = useState<string | null>(null);

  const sectionLabels = Object.fromEntries(
    BUILDER_SECTION_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<BuilderSectionType, string>;

  const handleDragStart = (sectionId: string) => {
    if (!canReorderInPreview) {
      return;
    }

    setDraggedSection(sectionId);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, sectionId: string) => {
    if (!canReorderInPreview || draggedSection === null) {
      return;
    }

    event.preventDefault();

    if (sectionId !== draggedSection) {
      setDropTargetSection(sectionId);
    }
  };

  const handleDrop = (targetSectionId: string) => {
    if (!canReorderInPreview || !onMoveSection || draggedSection === null) {
      return;
    }

    if (draggedSection !== targetSectionId) {
      onMoveSection(draggedSection, targetSectionId);
    }

    setDraggedSection(null);
    setDropTargetSection(null);
  };

  const resetDragState = () => {
    setDraggedSection(null);
    setDropTargetSection(null);
  };

  const renderSectionSeparator = (sectionId: string, className = "mt-3") => {
    const separatorWidth = Math.min(Math.max(draft.sectionSeparatorWidth[sectionId] ?? 100, 20), 100);
    const separatorColumns = Math.max(Math.ceil(previewSeparatorColumns * (separatorWidth / 100) * 4), previewSeparatorColumns);
    const separator = buildSectionSeparatorLine(draft.sectionSeparators[sectionId] ?? "none", separatorColumns);
    const separatorHeight = draft.sectionSeparatorHeight[sectionId] ?? 0;
    const effectiveBlankHeight = Math.max(16 + separatorHeight, 0);
    const effectiveLineHeight = Math.max(12 + separatorHeight, 0);

    if (separator === null) {
      return null;
    }

    if (separator === "") {
      return <div className={cn(className, "w-full")} style={{ height: `${effectiveBlankHeight}px` }} />;
    }

    return (
      <div
        className={cn(className, "flex items-center")}
        style={getFullBleedStyle(undefined, { minHeight: `${effectiveLineHeight}px` })}
      >
        <p
          className="mx-auto overflow-hidden whitespace-nowrap text-center text-[11px] leading-none"
          style={{
            width: `${separatorWidth}%`,
            color: draft.layout.textColor,
            opacity: 0.55,
            fontFamily: '"Courier New", "IBM Plex Mono", monospace',
          }}
        >
          {separator}
        </p>
      </div>
    );
  };

  const getFullBleedStyle = (widthPercent = 100, extraStyles?: CSSProperties): CSSProperties => ({
    marginLeft: `-${horizontalTicketPadding}px`,
    width: `calc(100% + ${horizontalTicketPadding * 2}px)`,
    ...extraStyles,
  });

  const renderSectionContent = (section: BuilderSectionInstance): ReactNode => {
    if (section.type === "header") {
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
          {renderSectionSeparator(section.id, "pt-2")}
        </div>
      );
    }

    if (section.type === "datetime") {
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
          {renderSectionSeparator(section.id)}
        </div>
      );
    }

    if (section.type === "columns") {
      return (
        <div>
          <div className="flex justify-between text-[11px] uppercase tracking-[0.14em] text-slate-500">
            <span>{draft.columnsLeftLabel}</span>
            <span>{draft.columnsRightLabel}</span>
          </div>
          {renderSectionSeparator(section.id, "mt-2")}
        </div>
      );
    }

    if (section.type === "line-items") {
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
          {renderSectionSeparator(section.id)}
        </div>
      );
    }

    if (section.type === "vat-details") {
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
          {renderSectionSeparator(section.id)}
        </div>
      );
    }

    if (section.type === "payment") {
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
          {renderSectionSeparator(section.id)}
        </div>
      );
    }

    if (section.type === "custom-message") {
      return (
        <div className="text-[11px]">
          {draft.customMessage && <p className="mt-2 leading-5 text-slate-600">{draft.customMessage}</p>}
          {draft.notes && <p className="mt-2 leading-5 text-slate-600">{draft.notes}</p>}
          {draft.footerMessage && <p className="mt-2 leading-5 text-slate-500">{draft.footerMessage}</p>}
          {renderSectionSeparator(section.id)}
        </div>
      );
    }

    if (section.type === "free-text") {
      const freeTextBlock = draft.freeTextBlocks.find((block) => block.id === section.id);
      const freeTextFontFamily = getFreeTextFontFamily(freeTextBlock?.fontFamily ?? "inter");
      const sanitizedHtml = sanitizeRichTextHtml(freeTextBlock?.content ?? "");

      return (
        <div>
          <div style={getFullBleedStyle()}>
            <div
              className={cn(
                "min-h-14 break-words px-0 [&_a]:text-blue-600 [&_a]:underline [&_p]:my-0 [&_ul]:my-0 [&_ol]:my-0",
                freeTextBlock?.alignment === "center" && "text-center",
                freeTextBlock?.alignment === "right" && "text-right",
              )}
              style={{
                fontFamily: freeTextFontFamily,
                fontSize: `${freeTextBlock?.fontSize ?? 18}px`,
                lineHeight: 1.45,
                letterSpacing: `${freeTextBlock?.letterSpacing ?? 0}px`,
              }}
              dangerouslySetInnerHTML={{ __html: sanitizedHtml || "&nbsp;" }}
            />
          </div>
          {renderSectionSeparator(section.id)}
        </div>
      );
    }

    if (section.type === "image") {
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
          {renderSectionSeparator(section.id)}
        </div>
      );
    }

    if (section.type === "barcode") {
      if (draft.barcodeType === "barcode" && draft.barcodeValue) {
        return (
          <div className="text-center text-[11px] text-slate-500">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <div className="h-14 bg-[repeating-linear-gradient(90deg,#1f1713_0,#1f1713_2px,transparent_2px,transparent_4px,#1f1713_4px,#1f1713_5px,transparent_5px,transparent_7px)]" />
              <p className="mt-2 tracking-[0.22em] text-slate-700">{draft.barcodeValue}</p>
              {draft.barcodeCaption && <p className="mt-1 text-slate-500">{draft.barcodeCaption}</p>}
            </div>
            {renderSectionSeparator(section.id)}
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
            {renderSectionSeparator(section.id)}
          </div>
        );
      }

      return null;
    }

    return null;
  };

  const renderPreviewSection = (section: BuilderSectionInstance, index: number) => {
    const content = renderSectionContent(section);

    if (!content) {
      return null;
    }

    const duplicateIndex =
      draft.builderSections.filter((entry) => entry.type === section.type).findIndex((entry) => entry.id === section.id) + 1;
    const labelBase = sectionLabels[section.type] ?? section.type;
    const label = section.type === "free-text" && draft.builderSections.filter((entry) => entry.type === section.type).length > 1
      ? `${labelBase} ${duplicateIndex}`
      : labelBase;
    const isDragging = draggedSection === section.id;
    const isDropTarget = dropTargetSection === section.id && draggedSection !== section.id;
    const spacingBefore = draft.sectionSpacingTop[section.id] ?? 0;
    const spacingAfter =
      draft.sectionSpacingBottom[section.id] ?? draft.sectionSpacing[section.id] ?? draft.layout.sectionSpacing;
    const hasNextSection = index < draft.builderSections.length - 1;

    return (
      <div
        key={section.id}
        onDragOver={(event) => handleDragOver(event, section.id)}
        onDrop={() => handleDrop(section.id)}
        className={cn(
          "relative transition-all duration-200 ease-out",
          isDragging && "opacity-45",
          isDropTarget && "rounded-xl ring-2 ring-blue-300 ring-offset-2 ring-offset-white",
        )}
        style={{
          marginTop: `${spacingBefore}px`,
          ...(hasNextSection ? { marginBottom: `${spacingAfter}px` } : {}),
        }}
        aria-label={`Sezione anteprima ${label}`}
      >
        {canReorderInPreview && (
          <div className="no-print mb-2 flex justify-end">
            <span
              draggable
              onDragStart={() => handleDragStart(section.id)}
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
            width: `${paperSpec.widthMm}mm`,
            minWidth: `${paperSpec.widthMm}mm`,
            maxWidth: `${paperSpec.widthMm}mm`,
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
            lineHeight: 1.5,
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
