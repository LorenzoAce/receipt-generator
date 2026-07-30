import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  CalendarClock,
  CreditCard,
  GripVertical,
  ImagePlus,
  LayoutList,
  MessageSquareQuote,
  Package2,
  PanelTop,
  Plus,
  ReceiptText,
  ScanBarcode,
  Type,
  Trash2,
  X,
} from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";
import { RichTextEditor } from "./RichTextEditor";
import { cn } from "../lib/utils";
import {
  BUILDER_SECTION_OPTIONS,
  SECTION_SEPARATOR_OPTIONS,
  formatCurrency,
  FREE_TEXT_FONT_OPTIONS,
  type BarcodeContentType,
  type QrShape,
  type SectionSeparatorStyle,
  type BuilderSectionType,
  type LogoAlignment,
  type ReceiptDraft,
  type ReceiptItem,
} from "../utils/receipt";

type SectionsBuilderProps = {
  draft: ReceiptDraft;
  onUpdateDraft: <K extends keyof ReceiptDraft>(field: K, value: ReceiptDraft[K]) => void;
  onAddSection: (section: BuilderSectionType) => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSection: (draggedSectionId: string, targetSectionId: string) => void;
  onUpdateFreeTextBlock: (sectionId: string, updates: Partial<ReceiptDraft["freeTextBlocks"][number]>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: <K extends keyof ReceiptItem>(id: string, field: K, value: ReceiptItem[K]) => void;
};

const sectionIcons = {
  header: PanelTop,
  datetime: CalendarClock,
  columns: LayoutList,
  "line-items": Package2,
  payment: CreditCard,
  "custom-message": MessageSquareQuote,
  "free-text": Type,
  image: ImagePlus,
  barcode: ScanBarcode,
  "vat-details": ReceiptText,
} satisfies Record<BuilderSectionType, typeof PanelTop>;

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "space-y-2 md:col-span-2" : "space-y-2"}>
      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</span>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  step,
  placeholder,
}: {
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date" | "time" | "url";
  step?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      step={step}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500/20"
    />
  );
}

export function SectionsBuilder({
  draft,
  onUpdateDraft,
  onAddSection,
  onRemoveSection,
  onMoveSection,
  onUpdateFreeTextBlock,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: SectionsBuilderProps) {
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dropTargetSection, setDropTargetSection] = useState<string | null>(null);
  const [isAddSectionsModalOpen, setIsAddSectionsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAddSectionsModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAddSectionsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddSectionsModalOpen]);

  const handleDragStart = (sectionId: string) => {
    setDraggedSection(sectionId);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, sectionId: string) => {
    event.preventDefault();
    if (sectionId !== draggedSection) {
      setDropTargetSection(sectionId);
    }
  };

  const handleDrop = (targetSectionId: string) => {
    if (draggedSection && draggedSection !== targetSectionId) {
      onMoveSection(draggedSection, targetSectionId);
    }
    setDraggedSection(null);
    setDropTargetSection(null);
  };

  const resetDragState = () => {
    setDraggedSection(null);
    setDropTargetSection(null);
  };

  const handleAddSection = (section: BuilderSectionType) => {
    onAddSection(section);
    setIsAddSectionsModalOpen(false);
  };

  const handleUpdateSectionSeparator = (sectionId: string, value: SectionSeparatorStyle) => {
    onUpdateDraft("sectionSeparators", {
      ...draft.sectionSeparators,
      [sectionId]: value,
    });
  };

  const handleUpdateSectionSpacing = (sectionId: string, value: number) => {
    onUpdateDraft("sectionSpacing", {
      ...draft.sectionSpacing,
      [sectionId]: value,
    });
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateDraft("logoImageUrl", typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  };

  const logoAlignmentOptions: Array<{ value: LogoAlignment; label: string; icon: typeof AlignLeft }> = [
    { value: "left", label: "Sinistra", icon: AlignLeft },
    { value: "center", label: "Centrato", icon: AlignCenter },
    { value: "right", label: "Destra", icon: AlignRight },
  ];
  const barcodeTypeOptions: Array<{ value: BarcodeContentType; label: string }> = [
    { value: "barcode", label: "Barcode" },
    { value: "qr-link", label: "QR Code da link" },
  ];
  const qrShapeOptions: Array<{ value: QrShape; label: string }> = [
    { value: "square", label: "Quadrato" },
    { value: "rounded", label: "Arrotondato" },
    { value: "soft", label: "Soft" },
  ];
  const freeTextAlignmentOptions = [
    { value: "left", label: "Sinistra", icon: AlignLeft },
    { value: "center", label: "Centrato", icon: AlignCenter },
    { value: "right", label: "Destra", icon: AlignRight },
  ] as const;

  return (
    <div className="space-y-6">
      {draft.builderSections.map((section) => {
        const sectionDefinition = BUILDER_SECTION_OPTIONS.find((entry) => entry.value === section.type);
        const Icon = sectionIcons[section.type];
        const isDragging = draggedSection === section.id;
        const isDropTarget = dropTargetSection === section.id && draggedSection !== section.id;
        const freeTextBlock = draft.freeTextBlocks.find((block) => block.id === section.id);
        const sameTypeCount = draft.builderSections.filter((entry) => entry.type === section.type).length;
        const displayTitle =
          section.type === "free-text" && sameTypeCount > 1
            ? `${sectionDefinition?.label ?? section.type} ${draft.builderSections
                .filter((entry) => entry.type === section.type)
                .findIndex((entry) => entry.id === section.id) + 1}`
            : sectionDefinition?.label ?? section.type;

        return (
          <div
            key={section.id}
            onDragOver={(event) => handleDragOver(event, section.id)}
            onDrop={() => handleDrop(section.id)}
            className={`rounded-2xl transition-all duration-200 ease-out ${
              isDragging ? "scale-[0.99] opacity-50" : "hover:-translate-y-0.5"
            } ${isDropTarget ? "ring-2 ring-blue-300 ring-offset-2 ring-offset-slate-50" : ""}`}
          >
            <CollapsibleCard
              title={displayTitle}
              icon={Icon}
              contentClassName="space-y-4 px-5 pb-5"
              headerLeading={
                <span
                  draggable
                  onDragStart={(event) => {
                    event.stopPropagation();
                    handleDragStart(section.id);
                  }}
                  onDragEnd={resetDragState}
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm cursor-grab active:cursor-grabbing"
                  aria-label={`Trascina ${displayTitle}`}
                  title="Trascina sezione"
                >
                  <GripVertical className="h-4 w-4" />
                </span>
              }
              headerActions={
                <button
                  type="button"
                  onClick={() => onRemoveSection(section.id)}
                  aria-label={`Rimuovi ${displayTitle}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 shadow-sm transition duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              }
            >
              {section.type === "header" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Logo" wide>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp,.svg,.gif,image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                        onChange={(event) => handleLogoUpload(event.target.files?.[0] ?? null)}
                        className="block w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:text-blue-700"
                      />
                      <p className="text-xs text-slate-500">PNG, JPG, WEBP, SVG, GIF</p>
                      {draft.logoImageUrl && (
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <img src={draft.logoImageUrl} alt="Anteprima logo" className="h-12 w-12 rounded object-contain" />
                          <button
                            type="button"
                            onClick={() => onUpdateDraft("logoImageUrl", "")}
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition duration-200 hover:border-red-200 hover:text-red-500"
                          >
                            Rimuovi logo
                          </button>
                        </div>
                      )}
                    </div>
                  </Field>
                  <Field label="Allineamento" wide>
                    <div className="grid grid-cols-3 gap-2">
                      {logoAlignmentOptions.map((option) => {
                        const Icon = option.icon;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => onUpdateDraft("logoAlignment", option.value)}
                            className={cn(
                              "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition duration-200",
                              draft.logoAlignment === option.value
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label={`Dimensione Logo ${draft.logoSize}px`} wide>
                    <input
                      type="range"
                      min="40"
                      max="180"
                      step="1"
                      value={draft.logoSize}
                      onChange={(event) => onUpdateDraft("logoSize", Number.parseInt(event.target.value, 10))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                    />
                  </Field>
                  <Field label={`Opacita Logo ${draft.logoOpacity}%`} wide>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={draft.logoOpacity}
                      onChange={(event) => onUpdateDraft("logoOpacity", Number.parseInt(event.target.value, 10))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                    />
                  </Field>
                  <Field label="Logo testuale">
                    <Input value={draft.logoText} onChange={(value) => onUpdateDraft("logoText", value)} />
                  </Field>
                  <Field label="Titolo">
                    <Input value={draft.title} onChange={(value) => onUpdateDraft("title", value)} />
                  </Field>
                  <Field label="Nome attivita" wide>
                    <Input value={draft.merchantName} onChange={(value) => onUpdateDraft("merchantName", value)} />
                  </Field>
                  <Field label="Indirizzo" wide>
                    <Input value={draft.merchantAddress} onChange={(value) => onUpdateDraft("merchantAddress", value)} />
                  </Field>
                  <Field label="Citta">
                    <Input value={draft.merchantCity} onChange={(value) => onUpdateDraft("merchantCity", value)} />
                  </Field>
                  <Field label="Telefono">
                    <Input value={draft.phone} onChange={(value) => onUpdateDraft("phone", value)} />
                  </Field>
                  <Field label="P.IVA">
                    <Input value={draft.vatNumber} onChange={(value) => onUpdateDraft("vatNumber", value)} />
                  </Field>
                </div>
              )}

              {section.type === "datetime" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Numero ricevuta">
                    <Input value={draft.receiptNumber} onChange={(value) => onUpdateDraft("receiptNumber", value)} />
                  </Field>
                  <Field label="Cassiere">
                    <Input value={draft.cashier} onChange={(value) => onUpdateDraft("cashier", value)} />
                  </Field>
                  <Field label="Data">
                    <Input type="date" value={draft.issueDate} onChange={(value) => onUpdateDraft("issueDate", value)} />
                  </Field>
                  <Field label="Ora">
                    <Input type="time" value={draft.issueTime} onChange={(value) => onUpdateDraft("issueTime", value)} />
                  </Field>
                </div>
              )}

              {section.type === "columns" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Titolo colonna sinistra">
                    <Input value={draft.columnsLeftLabel} onChange={(value) => onUpdateDraft("columnsLeftLabel", value)} />
                  </Field>
                  <Field label="Titolo colonna destra">
                    <Input value={draft.columnsRightLabel} onChange={(value) => onUpdateDraft("columnsRightLabel", value)} />
                  </Field>
                </div>
              )}

              {section.type === "line-items" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">Gestisci le voci che compaiono nel ticket.</p>
                    <button
                      type="button"
                      onClick={onAddItem}
                      className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition duration-200 hover:bg-blue-100"
                    >
                      <Plus className="h-4 w-4" />
                      Aggiungi voce
                    </button>
                  </div>

                  <div className="space-y-4">
                    {draft.items.map((item, index) => (
                      <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-slate-800">Voce {index + 1}</span>
                          {draft.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 transition duration-200 hover:border-red-200 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Rimuovi
                            </button>
                          )}
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <Field label="Descrizione" wide>
                            <Input
                              value={item.description}
                              onChange={(value) => onUpdateItem(item.id, "description", value)}
                            />
                          </Field>
                          <Field label="Qta">
                            <Input
                              type="number"
                              step="1"
                              value={item.quantity}
                              onChange={(value) => onUpdateItem(item.id, "quantity", Number.parseFloat(value || "0"))}
                            />
                          </Field>
                          <Field label="Prezzo">
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(value) => onUpdateItem(item.id, "unitPrice", Number.parseFloat(value || "0"))}
                            />
                          </Field>
                          <Field label="Sconto">
                            <Input
                              type="number"
                              step="0.01"
                              value={item.discount}
                              onChange={(value) => onUpdateItem(item.id, "discount", Number.parseFloat(value || "0"))}
                            />
                          </Field>
                          <Field label="IVA %">
                            <Input
                              type="number"
                              step="0.01"
                              value={item.vatRate}
                              onChange={(value) => onUpdateItem(item.id, "vatRate", Number.parseFloat(value || "0"))}
                            />
                          </Field>
                        </div>
                        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                          Totale riga:{" "}
                          {formatCurrency(Math.max(item.quantity * item.unitPrice - item.discount, 0), draft.currency)}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {section.type === "payment" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Metodo di pagamento">
                    <Input value={draft.paymentMethod} onChange={(value) => onUpdateDraft("paymentMethod", value)} />
                  </Field>
                  <Field label="Costo servizio">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.serviceFee}
                      onChange={(value) => onUpdateDraft("serviceFee", Number.parseFloat(value || "0"))}
                    />
                  </Field>
                  <Field label="Sconto extra">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.globalDiscount}
                      onChange={(value) => onUpdateDraft("globalDiscount", Number.parseFloat(value || "0"))}
                    />
                  </Field>
                </div>
              )}

              {section.type === "custom-message" && (
                <div className="space-y-3">
                  <Field label="Messaggio personalizzato" wide>
                    <textarea
                      value={draft.customMessage}
                      onChange={(event) => onUpdateDraft("customMessage", event.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </Field>
                  <Field label="Note" wide>
                    <textarea
                      value={draft.notes}
                      onChange={(event) => onUpdateDraft("notes", event.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </Field>
                  <Field label="Footer" wide>
                    <textarea
                      value={draft.footerMessage}
                      onChange={(event) => onUpdateDraft("footerMessage", event.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </Field>
                </div>
              )}

              {section.type === "free-text" && (
                <div className="space-y-4">
                  <Field label="Testo libero" wide>
                    <RichTextEditor
                      html={freeTextBlock?.content ?? ""}
                      onChange={(value) => onUpdateFreeTextBlock(section.id, { content: value })}
                      baseFontFamily={
                        FREE_TEXT_FONT_OPTIONS.find((option) => option.value === (freeTextBlock?.fontFamily ?? "inter"))
                          ?.family ?? FREE_TEXT_FONT_OPTIONS[0].family
                      }
                      baseFontSize={freeTextBlock?.fontSize ?? 18}
                      baseAlignment={freeTextBlock?.alignment ?? "left"}
                      baseLetterSpacing={freeTextBlock?.letterSpacing ?? 0}
                    />
                  </Field>
                  <Field label="Font" wide>
                    <div className="grid gap-2 sm:grid-cols-4">
                      {FREE_TEXT_FONT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => onUpdateFreeTextBlock(section.id, { fontFamily: option.value })}
                          className={cn(
                            "rounded-xl border px-3 py-3 text-sm transition duration-200",
                            freeTextBlock?.fontFamily === option.value
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-200",
                          )}
                          style={{ fontFamily: option.family }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={`Grandezza ${freeTextBlock?.fontSize ?? 18}px`} wide>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      step="1"
                      value={freeTextBlock?.fontSize ?? 18}
                      onChange={(event) =>
                        onUpdateFreeTextBlock(section.id, { fontSize: Number.parseInt(event.target.value, 10) })
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                    />
                  </Field>
                  <Field label={`Spaziatura lettere ${(freeTextBlock?.letterSpacing ?? 0).toFixed(1)}px`} wide>
                    <input
                      type="range"
                      min="-1"
                      max="8"
                      step="0.1"
                      value={freeTextBlock?.letterSpacing ?? 0}
                      onChange={(event) =>
                        onUpdateFreeTextBlock(section.id, { letterSpacing: Number.parseFloat(event.target.value) })
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                    />
                  </Field>
                  <Field label="Allineamento" wide>
                    <div className="grid grid-cols-3 gap-2">
                      {freeTextAlignmentOptions.map((option) => {
                        const Icon = option.icon;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => onUpdateFreeTextBlock(section.id, { alignment: option.value })}
                            className={cn(
                              "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition duration-200",
                              freeTextBlock?.alignment === option.value
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              )}

              {section.type === "image" && (
                <div className="grid gap-3">
                  <Field label="URL immagine" wide>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={draft.imageUrl}
                      onChange={(value) => onUpdateDraft("imageUrl", value)}
                    />
                  </Field>
                </div>
              )}

              {section.type === "barcode" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Tipo" wide>
                    <div className="grid grid-cols-2 gap-2">
                      {barcodeTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => onUpdateDraft("barcodeType", option.value)}
                          className={cn(
                            "inline-flex items-center justify-center rounded-xl border px-3 py-3 text-sm transition duration-200",
                            draft.barcodeType === option.value
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-200",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                  {draft.barcodeType === "barcode" ? (
                    <Field label="Valore codice" wide>
                      <Input value={draft.barcodeValue} onChange={(value) => onUpdateDraft("barcodeValue", value)} />
                    </Field>
                  ) : (
                    <>
                      <Field label="Link QR" wide>
                        <Input
                          type="url"
                          placeholder="https://..."
                          value={draft.barcodeLink}
                          onChange={(value) => onUpdateDraft("barcodeLink", value)}
                        />
                      </Field>
                      <Field label="Forma" wide>
                        <div className="grid grid-cols-3 gap-2">
                          {qrShapeOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => onUpdateDraft("qrShape", option.value)}
                              className={cn(
                                "inline-flex items-center justify-center rounded-xl border px-3 py-3 text-sm transition duration-200",
                                draft.qrShape === option.value
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200",
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label={`Grandezza QR ${draft.qrSize}px`} wide>
                        <input
                          type="range"
                          min="96"
                          max="220"
                          step="4"
                          value={draft.qrSize}
                          onChange={(event) => onUpdateDraft("qrSize", Number.parseInt(event.target.value, 10))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                        />
                      </Field>
                    </>
                  )}
                  <Field label="Didascalia" wide>
                    <Input value={draft.barcodeCaption} onChange={(value) => onUpdateDraft("barcodeCaption", value)} />
                  </Field>
                </div>
              )}

              {section.type === "vat-details" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                  I dettagli IVA vengono calcolati automaticamente in base alle voci inserite nella sezione Elenco
                  Voci. Modifica quantita, prezzi e aliquote per aggiornare il riepilogo.
                </div>
              )}

              <div className="space-y-3 border-t border-slate-200 pt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Separatore</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {SECTION_SEPARATOR_OPTIONS.map((option) => {
                    const isSelected = draft.sectionSeparators[section.id] === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleUpdateSectionSeparator(section.id, option.value)}
                        className={cn(
                          "shrink-0 rounded-lg border px-3 py-2 text-xs transition duration-200",
                          isSelected
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  {`Spazio sotto ${draft.sectionSpacing[section.id] ?? draft.layout.sectionSpacing}px`}
                </p>
                <input
                  type="range"
                  min="-16"
                  max="48"
                  step="1"
                  value={draft.sectionSpacing[section.id] ?? draft.layout.sectionSpacing}
                  onChange={(event) => handleUpdateSectionSpacing(section.id, Number.parseInt(event.target.value, 10))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                />
              </div>
            </CollapsibleCard>
          </div>
        );
      })}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)]">
        <button
          type="button"
          onClick={() => setIsAddSectionsModalOpen(true)}
          className="flex w-full items-center justify-center gap-3 px-5 py-5 text-center transition duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <Plus className="h-4 w-4" />
          </span>
          <span className="text-base font-bold text-slate-800 dark:text-slate-100">Aggiungi sezione</span>
        </button>
      </section>

      {isAddSectionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.34)] backdrop-blur-sm px-4 py-6" role="dialog" aria-modal="true" aria-label="Aggiungi sezioni">
          <button
            type="button"
            aria-label="Chiudi popup"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsAddSectionsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:p-6">
            <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                    <Plus className="h-4 w-4" />
                  </span>
                  Aggiungi sezione
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">Quale sezione vuoi aggiungere?</h3>
                <p className="text-sm leading-6 text-slate-600">
                  Seleziona una sezione dal popup. Le sezioni già presenti restano disattivate.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSectionsModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition duration-200 hover:border-blue-300 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {BUILDER_SECTION_OPTIONS.map((option) => {
                const isAdded = option.value === "free-text" ? false : draft.builderSections.some((entry) => entry.type === option.value);
                const OptionIcon = sectionIcons[option.value];

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAddSection(option.value)}
                    disabled={isAdded}
                    className={cn(
                      "rounded-2xl border px-4 py-4 text-left transition duration-200",
                      isAdded
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : "border-slate-200 bg-slate-50/70 text-slate-700 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]",
                    )}
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                        <OptionIcon className="h-4 w-4 shrink-0" />
                      </span>
                      <span>{option.actionLabel}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{option.description}</div>
                  </button>
                );
              })}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
