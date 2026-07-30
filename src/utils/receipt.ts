import { richTextHtmlToPlainText } from "./richText";

export type PaperWidth = "80mm" | "62mm";
export type DensityMode = "compact" | "airy";
export type HeaderAlignment = "left" | "center";
export type LogoAlignment = "left" | "center" | "right";
export type SeparatorStyle = "double" | "dots" | "dash";
export type SectionSeparatorStyle = "dash" | "equals" | "dots" | "stars" | "em-dash" | "blank" | "none";
export type BarcodeContentType = "barcode" | "qr-link";
export type QrShape = "square" | "rounded" | "soft";
export type CurrencyDisplay = "value-symbol" | "value" | "symbol-value" | "value-space-symbol";
export type PreviewFont = "font-1" | "font-2" | "font-3" | "font-4";
export type ThermalIntensity = "very-low" | "low" | "medium" | "high" | "very-high";
export type FreeTextAlignment = "left" | "center" | "right";
export type FreeTextFontFamily = "inter" | "system" | "cambria" | "courier-new" | "serif" | "mono";
export type BuilderSectionType =
  | "header"
  | "datetime"
  | "columns"
  | "line-items"
  | "payment"
  | "custom-message"
  | "free-text"
  | "image"
  | "barcode"
  | "vat-details";

export type ReceiptSectionKey =
  | "header"
  | "merchant"
  | "documentInfo"
  | "items"
  | "totals"
  | "payment"
  | "notes"
  | "footer";

export type ReceiptItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  vatRate: number;
};

export type ReceiptLayout = {
  density: DensityMode;
  headerAlignment: HeaderAlignment;
  separatorStyle: SeparatorStyle;
  sectionSpacing: number;
  currencyDisplay: CurrencyDisplay;
  previewFont: PreviewFont;
  textColor: string;
  thermalEffect: boolean;
  thermalIntensity: ThermalIntensity;
  textOpacity: number;
};

export type ReceiptDraft = {
  paperWidth: PaperWidth;
  templateId: string;
  title: string;
  logoText: string;
  logoImageUrl: string;
  logoAlignment: LogoAlignment;
  logoSize: number;
  logoOpacity: number;
  merchantName: string;
  merchantAddress: string;
  merchantCity: string;
  vatNumber: string;
  taxCode: string;
  phone: string;
  website: string;
  receiptNumber: string;
  issueDate: string;
  issueTime: string;
  cashier: string;
  currency: string;
  paymentMethod: string;
  customMessage: string;
  notes: string;
  footerMessage: string;
  imageUrl: string;
  barcodeType: BarcodeContentType;
  barcodeValue: string;
  barcodeLink: string;
  qrShape: QrShape;
  qrSize: number;
  barcodeCaption: string;
  columnsLeftLabel: string;
  columnsRightLabel: string;
  serviceFee: number;
  globalDiscount: number;
  items: ReceiptItem[];
  layout: ReceiptLayout;
  sections: Record<ReceiptSectionKey, boolean>;
  builderSections: BuilderSectionInstance[];
  sectionSeparators: Record<string, SectionSeparatorStyle>;
  sectionSpacing: Record<string, number>;
  sectionSpacingTop: Record<string, number>;
  sectionSpacingBottom: Record<string, number>;
  sectionSeparatorHeight: Record<string, number>;
  sectionSeparatorWidth: Record<string, number>;
  freeTextBlocks: FreeTextBlock[];
};

export type BuilderSectionInstance = {
  id: string;
  type: BuilderSectionType;
};

export type FreeTextBlock = {
  id: string;
  content: string;
  fontFamily: FreeTextFontFamily;
  fontSize: number;
  bold: boolean;
  alignment: FreeTextAlignment;
  letterSpacing: number;
};

export type ReceiptSummary = {
  subtotal: number;
  itemDiscounts: number;
  vatTotal: number;
  grandTotal: number;
};

export type ReceiptTemplate = {
  id: string;
  name: string;
  description: string;
  draft: Partial<ReceiptDraft>;
};

export const CURRENCY_DISPLAY_OPTIONS: Array<{ value: CurrencyDisplay; label: string }> = [
  { value: "value-symbol", label: "2.99EUR" },
  { value: "value", label: "2.99" },
  { value: "symbol-value", label: "EUR2.99" },
  { value: "value-space-symbol", label: "2.99 EUR" },
];

export const PREVIEW_FONT_OPTIONS: Array<{ value: PreviewFont; label: string; family: string }> = [
  { value: "font-1", label: "Font 1", family: '"IBM Plex Mono", monospace' },
  { value: "font-2", label: "Font 2", family: '"Courier Prime", monospace' },
  { value: "font-3", label: "Font 3", family: '"DM Mono", monospace' },
  { value: "font-4", label: "Font 4", family: '"Azeret Mono", monospace' },
];

export const FREE_TEXT_FONT_OPTIONS: Array<{ value: FreeTextFontFamily; label: string; family: string }> = [
  { value: "inter", label: "Inter", family: '"Inter", "Segoe UI", sans-serif' },
  { value: "system", label: "System", family: '"Segoe UI", Arial, sans-serif' },
  { value: "cambria", label: "Cambria", family: 'Cambria, Georgia, serif' },
  { value: "courier-new", label: "Courier New", family: '"Courier New", "IBM Plex Mono", monospace' },
  { value: "serif", label: "Serif", family: 'Georgia, "Times New Roman", serif' },
  { value: "mono", label: "Mono", family: '"IBM Plex Mono", "Courier New", monospace' },
];

type LegacyReceiptDraft = Partial<ReceiptDraft> & {
  builderSections?: Array<BuilderSectionType | BuilderSectionInstance>;
  freeTextContent?: string;
  freeTextFontFamily?: FreeTextFontFamily;
  freeTextFontSize?: number;
  freeTextBold?: boolean;
  freeTextAlignment?: FreeTextAlignment;
  freeTextLetterSpacing?: number;
};

export const THERMAL_INTENSITY_OPTIONS: Array<{ value: ThermalIntensity; label: string; opacityBoost: number }> = [
  { value: "very-low", label: "Molto Bassa", opacityBoost: 0.04 },
  { value: "low", label: "Bassa", opacityBoost: 0.08 },
  { value: "medium", label: "Media", opacityBoost: 0.12 },
  { value: "high", label: "Alta", opacityBoost: 0.18 },
  { value: "very-high", label: "Molto Alta", opacityBoost: 0.24 },
];

export const SECTION_SEPARATOR_OPTIONS: Array<{ value: SectionSeparatorStyle; label: string; preview: string }> = [
  { value: "dash", label: "---", preview: "---" },
  { value: "equals", label: "===", preview: "===" },
  { value: "dots", label: "...", preview: "..." },
  { value: "stars", label: "***", preview: "***" },
  { value: "em-dash", label: "———", preview: "———" },
  { value: "blank", label: "Blank", preview: "Blank" },
  { value: "none", label: "None", preview: "None" },
];

export const BUILDER_SECTION_OPTIONS: Array<{
  value: BuilderSectionType;
  label: string;
  actionLabel: string;
  description: string;
}> = [
  {
    value: "header",
    label: "Intestazione",
    actionLabel: "Intestazione",
    description: "Logo testuale, titolo e dati attivita.",
  },
  {
    value: "datetime",
    label: "Data e Ora",
    actionLabel: "Data e Ora",
    description: "Numero documento, data, ora e operatore.",
  },
  {
    value: "columns",
    label: "Colonne",
    actionLabel: "Colonne",
    description: "Titoli delle colonne del ticket.",
  },
  {
    value: "line-items",
    label: "Elenco Voci",
    actionLabel: "Elenco Voci",
    description: "Lista prodotti, prezzi, sconti e quantita.",
  },
  {
    value: "payment",
    label: "Pagamento",
    actionLabel: "Pagamento",
    description: "Metodo di pagamento e importi accessori.",
  },
  {
    value: "custom-message",
    label: "Messaggio Personalizzato",
    actionLabel: "Messaggio Personalizzato",
    description: "Messaggi finali, note e footer libero.",
  },
  {
    value: "free-text",
    label: "Testo libero",
    actionLabel: "Testo libero",
    description: "Blocco testo completamente libero con stile personalizzabile.",
  },
  {
    value: "image",
    label: "Immagine",
    actionLabel: "Immagine",
    description: "URL immagine da mostrare nel ticket.",
  },
  {
    value: "barcode",
    label: "Codice",
    actionLabel: "Codice",
    description: "Barcode classico oppure QR code da link.",
  },
  {
    value: "vat-details",
    label: "Dettagli IVA",
    actionLabel: "Dettagli IVA",
    description: "Riepilogo aliquote e imponibili.",
  },
];

export const SECTION_LABELS: Array<{ key: ReceiptSectionKey; label: string }> = [
  { key: "header", label: "Intestazione" },
  { key: "merchant", label: "Esercente" },
  { key: "documentInfo", label: "Dati documento" },
  { key: "items", label: "Articoli" },
  { key: "totals", label: "Totali" },
  { key: "payment", label: "Pagamento" },
  { key: "notes", label: "Note" },
  { key: "footer", label: "Footer" },
];

export const PAPER_SPECS: Record<PaperWidth, { widthMm: number; columns: number }> = {
  "80mm": { widthMm: 80, columns: 32 },
  "62mm": { widthMm: 62, columns: 24 },
};

const baseSections: Record<ReceiptSectionKey, boolean> = {
  header: true,
  merchant: true,
  documentInfo: true,
  items: true,
  totals: true,
  payment: true,
  notes: true,
  footer: true,
};

export const createEmptyItem = (): ReceiptItem => ({
  id: crypto.randomUUID(),
  description: "Prodotto",
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  vatRate: 22,
});

export const createDefaultDraft = (): ReceiptDraft => ({
  paperWidth: "80mm",
  templateId: "retail",
  title: "Ricevuta di vendita",
  logoText: "BOTTEGA",
  logoImageUrl: "",
  logoAlignment: "center",
  logoSize: 88,
  logoOpacity: 100,
  merchantName: "Bottega Aurora",
  merchantAddress: "Via delle Stampe 14",
  merchantCity: "Milano",
  vatNumber: "IT12345678901",
  taxCode: "CFNRSL80A01F205X",
  phone: "+39 02 555 4422",
  website: "www.bottega-aurora.it",
  receiptNumber: "RC-2026-078",
  issueDate: "2026-07-28",
  issueTime: "18:45",
  cashier: "Giulia",
  currency: "EUR",
  paymentMethod: "Carta",
  customMessage: "Grazie per la visita. Ti aspettiamo presto.",
  notes: "Cambio merce entro 7 giorni con scontrino.",
  footerMessage: "",
  imageUrl: "",
  barcodeType: "barcode",
  barcodeValue: "8051234567890",
  barcodeLink: "https://example.com/ricevuta/RC-2026-078",
  qrShape: "square",
  qrSize: 160,
  barcodeCaption: "Documento interno",
  columnsLeftLabel: "Articolo",
  columnsRightLabel: "Totale",
  serviceFee: 0,
  globalDiscount: 0,
  layout: {
    density: "compact",
    headerAlignment: "center",
    separatorStyle: "double",
    sectionSpacing: 20,
    currencyDisplay: "value-space-symbol",
    previewFont: "font-1",
    textColor: "#342a24",
    thermalEffect: true,
    thermalIntensity: "medium",
    textOpacity: 88,
  },
  items: [
    {
      id: crypto.randomUUID(),
      description: "Pane rustico",
      quantity: 2,
      unitPrice: 2.8,
      discount: 0,
      vatRate: 4,
    },
    {
      id: crypto.randomUUID(),
      description: "Confettura artigianale",
      quantity: 1,
      unitPrice: 6.9,
      discount: 0.5,
      vatRate: 10,
    },
  ],
  sections: { ...baseSections },
  builderSections: [],
  sectionSeparators: {},
  sectionSpacing: {},
  sectionSpacingTop: {},
  sectionSpacingBottom: {},
  sectionSeparatorHeight: {},
  sectionSeparatorWidth: {},
  freeTextBlocks: [],
});

export function createBuilderSection(type: BuilderSectionType, id: string = crypto.randomUUID()): BuilderSectionInstance {
  return { id, type };
}

export function createFreeTextBlock(id: string = crypto.randomUUID(), overrides?: Partial<FreeTextBlock>): FreeTextBlock {
  return {
    id,
    content: "",
    fontFamily: "inter",
    fontSize: 18,
    bold: false,
    alignment: "left",
    letterSpacing: 0,
    ...overrides,
  };
}

function normalizeBuilderSections(sections?: Array<BuilderSectionType | BuilderSectionInstance>) {
  if (!sections || sections.length === 0) {
    return [] as BuilderSectionInstance[];
  }

  return sections.map((section) =>
    typeof section === "string" ? createBuilderSection(section) : createBuilderSection(section.type, section.id),
  );
}

function normalizeFreeTextBlocks(
  partial: LegacyReceiptDraft,
  builderSections: BuilderSectionInstance[],
) {
  const existingBlocks = Array.isArray(partial.freeTextBlocks) ? partial.freeTextBlocks : [];
  let hasUsedLegacyFields = false;

  return builderSections
    .filter((section) => section.type === "free-text")
    .map((section) => {
      const matchedBlock = existingBlocks.find((block) => block.id === section.id);

      if (matchedBlock) {
        return createFreeTextBlock(section.id, {
          content: matchedBlock.content,
          fontFamily: matchedBlock.fontFamily,
          fontSize: matchedBlock.fontSize,
          bold: matchedBlock.bold,
          alignment: matchedBlock.alignment,
          letterSpacing: matchedBlock.letterSpacing,
        });
      }

      if (!hasUsedLegacyFields) {
        hasUsedLegacyFields = true;
        return createFreeTextBlock(section.id, {
          content: partial.freeTextContent ?? "",
          fontFamily: partial.freeTextFontFamily ?? "inter",
          fontSize: partial.freeTextFontSize ?? 18,
          bold: partial.freeTextBold ?? false,
          alignment: partial.freeTextAlignment ?? "left",
          letterSpacing: partial.freeTextLetterSpacing ?? 0,
        });
      }

      return createFreeTextBlock(section.id);
    });
}

export function normalizeDraft(partial?: LegacyReceiptDraft | null): ReceiptDraft {
  const defaults = createDefaultDraft();

  if (!partial) {
    return defaults;
  }

  const mergedLayout = {
    ...defaults.layout,
    ...partial.layout,
  };
  const builderSections = normalizeBuilderSections(partial.builderSections);
  const freeTextBlocks = normalizeFreeTextBlocks(partial, builderSections);
  const separatorDefaults = createDefaultSectionSeparators(mergedLayout.separatorStyle, builderSections);
  const spacingDefaults = createDefaultSectionSpacing(mergedLayout.sectionSpacing, builderSections);
  const migratedSeparators = builderSections.reduce<Record<string, SectionSeparatorStyle>>((accumulator, section) => {
    const legacySeparators = partial.sectionSeparators as Record<string, SectionSeparatorStyle> | undefined;
    const value = legacySeparators?.[section.id] ?? legacySeparators?.[section.type];

    if (value) {
      accumulator[section.id] = value;
    }

    return accumulator;
  }, {});
  const migratedSpacing = builderSections.reduce<Record<string, number>>((accumulator, section) => {
    const legacySpacing = partial.sectionSpacing as Record<string, number> | undefined;
    const value = legacySpacing?.[section.id] ?? legacySpacing?.[section.type];

    if (typeof value === "number" && Number.isFinite(value)) {
      accumulator[section.id] = value;
    }

    return accumulator;
  }, {});
  const migratedSpacingTop = builderSections.reduce<Record<string, number>>((accumulator, section) => {
    const spacingTop = partial.sectionSpacingTop as Record<string, number> | undefined;
    const legacySpacing = partial.sectionSpacing as Record<string, number> | undefined;
    const value =
      spacingTop?.[section.id] ??
      spacingTop?.[section.type] ??
      legacySpacing?.[section.id] ??
      legacySpacing?.[section.type] ??
      0;

    if (typeof value === "number" && Number.isFinite(value)) {
      accumulator[section.id] = value;
    }

    return accumulator;
  }, {});
  const migratedSpacingBottom = builderSections.reduce<Record<string, number>>((accumulator, section) => {
    const spacingBottom = partial.sectionSpacingBottom as Record<string, number> | undefined;
    const legacySpacing = partial.sectionSpacing as Record<string, number> | undefined;
    const value =
      spacingBottom?.[section.id] ??
      spacingBottom?.[section.type] ??
      legacySpacing?.[section.id] ??
      legacySpacing?.[section.type] ??
      mergedLayout.sectionSpacing;

    if (typeof value === "number" && Number.isFinite(value)) {
      accumulator[section.id] = value;
    }

    return accumulator;
  }, {});
  const separatorHeightDefaults = createDefaultSectionSeparatorHeight(builderSections);
  const migratedSeparatorHeight = builderSections.reduce<Record<string, number>>((accumulator, section) => {
    const separatorHeight = partial.sectionSeparatorHeight as Record<string, number> | undefined;
    const value = separatorHeight?.[section.id] ?? separatorHeight?.[section.type];

    if (typeof value === "number" && Number.isFinite(value)) {
      accumulator[section.id] = value;
    }

    return accumulator;
  }, {});
  const separatorWidthDefaults = createDefaultSectionSeparatorWidth(builderSections);
  const migratedSeparatorWidth = builderSections.reduce<Record<string, number>>((accumulator, section) => {
    const separatorWidth = partial.sectionSeparatorWidth as Record<string, number> | undefined;
    const value = separatorWidth?.[section.id] ?? separatorWidth?.[section.type];

    if (typeof value === "number" && Number.isFinite(value)) {
      accumulator[section.id] = value;
    }

    return accumulator;
  }, {});

  return {
    ...defaults,
    ...partial,
    items: partial.items && partial.items.length > 0 ? partial.items : defaults.items,
    layout: mergedLayout,
    sections: {
      ...defaults.sections,
      ...partial.sections,
    },
    builderSections,
    sectionSeparators: {
      ...separatorDefaults,
      ...migratedSeparators,
    },
    sectionSpacing: {
      ...spacingDefaults,
      ...migratedSpacing,
    },
    sectionSpacingTop: {
      ...createDefaultSectionSpacing(0, builderSections),
      ...migratedSpacingTop,
    },
    sectionSpacingBottom: {
      ...spacingDefaults,
      ...migratedSpacingBottom,
    },
    sectionSeparatorHeight: {
      ...separatorHeightDefaults,
      ...migratedSeparatorHeight,
    },
    sectionSeparatorWidth: {
      ...separatorWidthDefaults,
      ...migratedSeparatorWidth,
    },
    freeTextBlocks,
  };
}

export function hasBuilderSection(draft: ReceiptDraft, section: BuilderSectionType) {
  return draft.builderSections.some((entry) => entry.type === section);
}

export function reorderBuilderSections(
  sections: BuilderSectionInstance[],
  draggedSectionId: string,
  targetSectionId: string,
) {
  if (draggedSectionId === targetSectionId) {
    return sections;
  }

  const next = [...sections];
  const draggedIndex = next.findIndex((section) => section.id === draggedSectionId);
  const targetIndex = next.findIndex((section) => section.id === targetSectionId);

  if (draggedIndex === -1 || targetIndex === -1) {
    return sections;
  }

  const [draggedSection] = next.splice(draggedIndex, 1);
  next.splice(targetIndex, 0, draggedSection);
  return next;
}

export function getVatBreakdown(items: ReceiptItem[]) {
  const vatMap = new Map<number, { taxable: number; vat: number }>();

  items.forEach((item) => {
    const taxable = calculateLineTotal(item);
    const current = vatMap.get(item.vatRate) ?? { taxable: 0, vat: 0 };
    current.taxable += taxable;
    current.vat += taxable * (item.vatRate / 100);
    vatMap.set(item.vatRate, current);
  });

  return Array.from(vatMap.entries())
    .map(([rate, values]) => ({ rate, ...values }))
    .sort((left, right) => left.rate - right.rate);
}

export function createDefaultSectionSeparators(
  layoutSeparatorStyle: SeparatorStyle,
  builderSections: BuilderSectionInstance[],
): Record<string, SectionSeparatorStyle> {
  const fallback = mapLayoutSeparatorStyle(layoutSeparatorStyle);

  return builderSections.reduce<Record<string, SectionSeparatorStyle>>((accumulator, section) => {
    accumulator[section.id] = fallback;
    return accumulator;
  }, {});
}

export function createDefaultSectionSpacing(
  fallbackSpacing: number,
  builderSections: BuilderSectionInstance[],
): Record<string, number> {
  return builderSections.reduce<Record<string, number>>((accumulator, section) => {
    accumulator[section.id] = fallbackSpacing;
    return accumulator;
  }, {});
}

export function createDefaultSectionSeparatorHeight(
  builderSections: BuilderSectionInstance[],
): Record<string, number> {
  return builderSections.reduce<Record<string, number>>((accumulator, section) => {
    accumulator[section.id] = 0;
    return accumulator;
  }, {});
}

export function createDefaultSectionSeparatorWidth(
  builderSections: BuilderSectionInstance[],
): Record<string, number> {
  return builderSections.reduce<Record<string, number>>((accumulator, section) => {
    accumulator[section.id] = 100;
    return accumulator;
  }, {});
}

export const receiptTemplates: ReceiptTemplate[] = [
  {
    id: "free",
    name: "Libero",
    description: "Canvas essenziale con un blocco di testo libero da comporre come vuoi.",
    draft: {
      paperWidth: "80mm",
      title: "",
      logoText: "",
      merchantName: "",
      merchantAddress: "",
      merchantCity: "",
      vatNumber: "",
      taxCode: "",
      phone: "",
      website: "",
      receiptNumber: "",
      issueDate: "",
      issueTime: "",
      cashier: "",
      paymentMethod: "",
      customMessage: "",
      notes: "",
      footerMessage: "",
      imageUrl: "",
      barcodeCaption: "",
      builderSections: [createBuilderSection("free-text", "free-text-template")],
      freeTextBlocks: [createFreeTextBlock("free-text-template")],
      layout: {
        density: "airy",
        headerAlignment: "left",
        separatorStyle: "dash",
        sectionSpacing: 22,
        currencyDisplay: "value-space-symbol",
        previewFont: "font-1",
        textColor: "#1f2937",
        thermalEffect: false,
        thermalIntensity: "low",
        textOpacity: 100,
      },
    },
  },
  {
    id: "retail",
    name: "Retail classico",
    description: "Impaginazione ordinata con dati fiscali e righe prodotto complete.",
    draft: {
      paperWidth: "80mm",
      title: "Ricevuta di vendita",
      logoText: "BOTTEGA",
      merchantName: "Bottega Aurora",
      paymentMethod: "Carta",
      customMessage: "Grazie per la visita. Ti aspettiamo presto.",
      barcodeType: "barcode",
      barcodeValue: "8051234567890",
      qrShape: "square",
      qrSize: 160,
      barcodeCaption: "Documento interno",
      columnsLeftLabel: "Articolo",
      columnsRightLabel: "Totale",
      layout: {
        density: "compact",
        headerAlignment: "center",
        separatorStyle: "double",
        sectionSpacing: 20,
        currencyDisplay: "value-space-symbol",
        previewFont: "font-1",
        textColor: "#342a24",
        thermalEffect: true,
        thermalIntensity: "medium",
        textOpacity: 88,
      },
      sections: { ...baseSections },
      builderSections: [
        createBuilderSection("header", "retail-header"),
        createBuilderSection("datetime", "retail-datetime"),
        createBuilderSection("columns", "retail-columns"),
        createBuilderSection("line-items", "retail-line-items"),
        createBuilderSection("payment", "retail-payment"),
        createBuilderSection("custom-message", "retail-custom-message"),
        createBuilderSection("vat-details", "retail-vat-details"),
      ],
    },
  },
  {
    id: "cafe",
    name: "Cafe veloce",
    description: "Formato essenziale per cassa bar con carta da 62mm e ticket rapido.",
    draft: {
      paperWidth: "62mm",
      title: "Scontrino rapido",
      logoText: "CAFFE",
      merchantName: "Caffe Binario",
      paymentMethod: "Contanti",
      customMessage: "Passa di nuovo per la tua pausa caffe.",
      barcodeType: "barcode",
      barcodeValue: "2200000123456",
      qrShape: "square",
      qrSize: 160,
      barcodeCaption: "Comanda banco",
      columnsLeftLabel: "Voce",
      columnsRightLabel: "Prezzo",
      layout: {
        density: "compact",
        headerAlignment: "center",
        separatorStyle: "dots",
        sectionSpacing: 16,
        currencyDisplay: "symbol-value",
        previewFont: "font-2",
        textColor: "#2f2824",
        thermalEffect: true,
        thermalIntensity: "high",
        textOpacity: 84,
      },
      sections: { ...baseSections, notes: false },
      builderSections: [
        createBuilderSection("header", "cafe-header"),
        createBuilderSection("datetime", "cafe-datetime"),
        createBuilderSection("columns", "cafe-columns"),
        createBuilderSection("line-items", "cafe-line-items"),
        createBuilderSection("payment", "cafe-payment"),
        createBuilderSection("barcode", "cafe-barcode"),
      ],
    },
  },
  {
    id: "studio",
    name: "Ricevuta professionale",
    description: "Look piu editoriale per freelance, artigiani e attivita su appuntamento.",
    draft: {
      paperWidth: "80mm",
      title: "Ricevuta professionale",
      logoText: "STUDIO",
      merchantName: "Studio Linea",
      paymentMethod: "Bonifico",
      customMessage: "Documento emesso per prestazione professionale.",
      barcodeType: "barcode",
      barcodeValue: "STUDIO-2026-078",
      qrShape: "square",
      qrSize: 160,
      barcodeCaption: "Archivio pratica",
      columnsLeftLabel: "Dettaglio",
      columnsRightLabel: "Importo",
      layout: {
        density: "airy",
        headerAlignment: "left",
        separatorStyle: "dash",
        sectionSpacing: 24,
        currencyDisplay: "value",
        previewFont: "font-4",
        textColor: "#3b322d",
        thermalEffect: false,
        thermalIntensity: "low",
        textOpacity: 96,
      },
      sections: { ...baseSections },
      builderSections: [
        createBuilderSection("header", "studio-header"),
        createBuilderSection("datetime", "studio-datetime"),
        createBuilderSection("columns", "studio-columns"),
        createBuilderSection("line-items", "studio-line-items"),
        createBuilderSection("payment", "studio-payment"),
        createBuilderSection("custom-message", "studio-custom-message"),
        createBuilderSection("vat-details", "studio-vat-details"),
      ],
    },
  },
];

export function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrencyForPreview(value: number, currency: string, display: CurrencyDisplay) {
  const amount = formatCurrency(value, currency);
  const symbol = currency === "EUR" ? "EUR" : currency;

  if (display === "value") return amount;
  if (display === "value-symbol") return `${amount}${symbol}`;
  if (display === "symbol-value") return `${symbol}${amount}`;
  if (display === "value-space-symbol") return `${amount} ${symbol}`;

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function getPreviewFontFamily(previewFont: PreviewFont) {
  return PREVIEW_FONT_OPTIONS.find((option) => option.value === previewFont)?.family ?? PREVIEW_FONT_OPTIONS[0].family;
}

export function getFreeTextFontFamily(fontFamily: FreeTextFontFamily) {
  return FREE_TEXT_FONT_OPTIONS.find((option) => option.value === fontFamily)?.family ?? FREE_TEXT_FONT_OPTIONS[0].family;
}

export function getThermalIntensityBoost(intensity: ThermalIntensity) {
  return THERMAL_INTENSITY_OPTIONS.find((option) => option.value === intensity)?.opacityBoost ?? 0.12;
}

export function calculateLineTotal(item: ReceiptItem) {
  return Math.max(item.quantity * item.unitPrice - item.discount, 0);
}

export function calculateSummary(draft: ReceiptDraft): ReceiptSummary {
  const subtotal = draft.items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const itemDiscounts = draft.items.reduce((sum, item) => sum + Math.max(item.discount, 0), 0) + draft.globalDiscount;
  const vatTotal = draft.items.reduce((sum, item) => sum + calculateLineTotal(item) * (item.vatRate / 100), 0);
  const grandTotal = Math.max(subtotal + vatTotal + draft.serviceFee - draft.globalDiscount, 0);

  return {
    subtotal,
    itemDiscounts,
    vatTotal,
    grandTotal,
  };
}

export function separatorLine(style: SeparatorStyle, columns: number) {
  if (style === "dots") return ".".repeat(columns);
  if (style === "dash") return "-".repeat(columns);
  return "=".repeat(columns);
}

export function mapLayoutSeparatorStyle(style: SeparatorStyle): SectionSeparatorStyle {
  if (style === "dots") return "dots";
  if (style === "dash") return "dash";
  return "equals";
}

export function buildSectionSeparatorLine(style: SectionSeparatorStyle, columns: number) {
  if (style === "none") return null;
  if (style === "blank") return "";
  if (style === "dots") return ".".repeat(columns);
  if (style === "stars") return "*".repeat(columns);
  if (style === "em-dash") return "—".repeat(columns);
  if (style === "dash") return "-".repeat(columns);
  return "=".repeat(columns);
}

export function buildQrCodeImageUrl(value: string, size = 180) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(normalizedValue)}`;
}

function wrapText(text: string, columns: number) {
  if (!text) return [""];

  return text.split("\n").flatMap((line) => {
    if (line.length <= columns) return [line];

    const words = line.split(" ");
    const rows: string[] = [];
    let current = "";

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= columns) {
        current = candidate;
      } else {
        if (current) rows.push(current);
        current = word;
      }
    });

    if (current) rows.push(current);
    return rows;
  });
}

function alignLine(text: string, columns: number, alignment: HeaderAlignment | "right") {
  if (alignment === "left") return text;
  if (alignment === "right") {
    const padding = Math.max(columns - text.length, 0);
    return `${" ".repeat(padding)}${text}`;
  }
  const padding = Math.max(Math.floor((columns - text.length) / 2), 0);
  return `${" ".repeat(padding)}${text}`;
}

export function buildReceiptLines(draft: ReceiptDraft) {
  const { columns } = PAPER_SPECS[draft.paperWidth];
  const summary = calculateSummary(draft);
  const lines: string[] = [];
  const vatBreakdown = getVatBreakdown(draft.items);

  const addWrapped = (text: string, alignment: HeaderAlignment | "right" = "left") => {
    wrapText(text, columns).forEach((row) => lines.push(alignLine(row, columns, alignment)));
  };

  const addSectionSeparator = (sectionId: string) => {
    const separator = buildSectionSeparatorLine(draft.sectionSeparators[sectionId] ?? "none", columns);
    if (separator !== null) {
      lines.push(separator);
    }
  };

  draft.builderSections.forEach((section) => {
    if (section.type === "header") {
      addWrapped(draft.logoText, draft.layout.headerAlignment);
      addWrapped(draft.title, draft.layout.headerAlignment);
      addWrapped(draft.merchantName);
      addWrapped(draft.merchantAddress);
      addWrapped(draft.merchantCity);
      if (draft.vatNumber) addWrapped(`P.IVA ${draft.vatNumber}`);
      if (draft.phone) addWrapped(draft.phone);
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "datetime") {
      addWrapped(`Ricevuta ${draft.receiptNumber}`);
      addWrapped(`${draft.issueDate}  ${draft.issueTime}`);
      addWrapped(`Cassa ${draft.cashier}`);
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "columns") {
      addWrapped(`${draft.columnsLeftLabel} / ${draft.columnsRightLabel}`);
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "line-items") {
      draft.items.forEach((item) => {
        addWrapped(item.description);
        const detail = `${item.quantity} x ${item.unitPrice.toFixed(2)}  IVA ${item.vatRate}%`;
        addWrapped(detail);
        addWrapped(`Totale riga ${calculateLineTotal(item).toFixed(2)}`);
      });
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "vat-details") {
      vatBreakdown.forEach((row) => {
        addWrapped(`IVA ${row.rate}%  Imp. ${row.taxable.toFixed(2)}`);
        addWrapped(`Imposta ${row.vat.toFixed(2)}`);
      });
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "payment") {
      addWrapped(`Subtotale ${summary.subtotal.toFixed(2)}`);
      if (draft.globalDiscount > 0) addWrapped(`Sconto extra -${draft.globalDiscount.toFixed(2)}`);
      if (draft.serviceFee > 0) addWrapped(`Servizio ${draft.serviceFee.toFixed(2)}`);
      addWrapped(`IVA ${summary.vatTotal.toFixed(2)}`);
      addWrapped(`Totale ${summary.grandTotal.toFixed(2)}`);
      addWrapped(`Pagamento ${draft.paymentMethod}`);
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "custom-message") {
      if (draft.customMessage) addWrapped(draft.customMessage);
      if (draft.notes) addWrapped(draft.notes);
      if (draft.footerMessage) addWrapped(draft.footerMessage, draft.layout.headerAlignment);
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "free-text") {
      const block = draft.freeTextBlocks.find((entry) => entry.id === section.id);
      const alignment = block?.alignment === "center" ? "center" : block?.alignment === "right" ? "right" : "left";
      const plainText = block ? richTextHtmlToPlainText(block.content) : "";
      if (plainText) addWrapped(plainText, alignment);
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "image" && draft.imageUrl) {
      addWrapped("[Immagine]");
      addWrapped(draft.imageUrl);
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "barcode" && draft.barcodeType === "barcode" && draft.barcodeValue) {
      addWrapped(`[BARCODE ${draft.barcodeValue}]`);
      if (draft.barcodeCaption) addWrapped(draft.barcodeCaption);
      addSectionSeparator(section.id);
      return;
    }

    if (section.type === "barcode" && draft.barcodeType === "qr-link" && draft.barcodeLink) {
      addWrapped("[QR CODE]");
      addWrapped(draft.barcodeLink);
      if (draft.barcodeCaption) addWrapped(draft.barcodeCaption);
      addSectionSeparator(section.id);
    }
  });

  return lines;
}
