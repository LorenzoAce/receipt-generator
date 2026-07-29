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
export type BuilderSectionType =
  | "header"
  | "datetime"
  | "columns"
  | "line-items"
  | "payment"
  | "custom-message"
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
  builderSections: BuilderSectionType[];
  sectionSeparators: Record<BuilderSectionType, SectionSeparatorStyle>;
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

export const PAPER_SPECS: Record<PaperWidth, { widthMm: number; widthPx: number; columns: number }> = {
  "80mm": { widthMm: 80, widthPx: 332, columns: 32 },
  "62mm": { widthMm: 62, widthPx: 258, columns: 24 },
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
  sectionSeparators: createDefaultSectionSeparators("double"),
});

export function normalizeDraft(partial?: Partial<ReceiptDraft> | null): ReceiptDraft {
  const defaults = createDefaultDraft();

  if (!partial) {
    return defaults;
  }

  const mergedLayout = {
    ...defaults.layout,
    ...partial.layout,
  };
  const separatorDefaults = createDefaultSectionSeparators(mergedLayout.separatorStyle);

  return {
    ...defaults,
    ...partial,
    items: partial.items && partial.items.length > 0 ? partial.items : defaults.items,
    layout: mergedLayout,
    sections: {
      ...defaults.sections,
      ...partial.sections,
    },
    builderSections:
      partial.builderSections && partial.builderSections.length > 0
        ? partial.builderSections
        : defaults.builderSections,
    sectionSeparators: {
      ...separatorDefaults,
      ...partial.sectionSeparators,
    },
  };
}

export function hasBuilderSection(draft: ReceiptDraft, section: BuilderSectionType) {
  return draft.builderSections.includes(section);
}

export function reorderBuilderSections(
  sections: BuilderSectionType[],
  draggedSection: BuilderSectionType,
  targetSection: BuilderSectionType,
) {
  if (draggedSection === targetSection) {
    return sections;
  }

  const next = [...sections];
  const draggedIndex = next.indexOf(draggedSection);
  const targetIndex = next.indexOf(targetSection);

  if (draggedIndex === -1 || targetIndex === -1) {
    return sections;
  }

  next.splice(draggedIndex, 1);
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

export function createDefaultSectionSeparators(layoutSeparatorStyle: SeparatorStyle): Record<BuilderSectionType, SectionSeparatorStyle> {
  const fallback = mapLayoutSeparatorStyle(layoutSeparatorStyle);

  return {
    header: fallback,
    datetime: fallback,
    columns: fallback,
    "line-items": fallback,
    payment: fallback,
    "custom-message": fallback,
    image: fallback,
    barcode: fallback,
    "vat-details": fallback,
  };
}

export const receiptTemplates: ReceiptTemplate[] = [
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
        currencyDisplay: "value-space-symbol",
        previewFont: "font-1",
        textColor: "#342a24",
        thermalEffect: true,
        thermalIntensity: "medium",
        textOpacity: 88,
      },
      sections: { ...baseSections },
      builderSections: [
        "header",
        "datetime",
        "columns",
        "line-items",
        "payment",
        "custom-message",
        "vat-details",
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
        currencyDisplay: "symbol-value",
        previewFont: "font-2",
        textColor: "#2f2824",
        thermalEffect: true,
        thermalIntensity: "high",
        textOpacity: 84,
      },
      sections: { ...baseSections, notes: false },
      builderSections: ["header", "datetime", "columns", "line-items", "payment", "barcode"],
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
        currencyDisplay: "value",
        previewFont: "font-4",
        textColor: "#3b322d",
        thermalEffect: false,
        thermalIntensity: "low",
        textOpacity: 96,
      },
      sections: { ...baseSections },
      builderSections: ["header", "datetime", "columns", "line-items", "payment", "custom-message", "vat-details"],
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

function alignLine(text: string, columns: number, alignment: HeaderAlignment) {
  if (alignment === "left") return text;
  const padding = Math.max(Math.floor((columns - text.length) / 2), 0);
  return `${" ".repeat(padding)}${text}`;
}

export function buildReceiptLines(draft: ReceiptDraft) {
  const { columns } = PAPER_SPECS[draft.paperWidth];
  const summary = calculateSummary(draft);
  const lines: string[] = [];
  const vatBreakdown = getVatBreakdown(draft.items);

  const addWrapped = (text: string, alignment: HeaderAlignment = "left") => {
    wrapText(text, columns).forEach((row) => lines.push(alignLine(row, columns, alignment)));
  };

  const addSectionSeparator = (section: BuilderSectionType) => {
    const separator = buildSectionSeparatorLine(draft.sectionSeparators[section], columns);
    if (separator !== null) {
      lines.push(separator);
    }
  };

  draft.builderSections.forEach((section) => {
    if (section === "header") {
      addWrapped(draft.logoText, draft.layout.headerAlignment);
      addWrapped(draft.title, draft.layout.headerAlignment);
      addWrapped(draft.merchantName);
      addWrapped(draft.merchantAddress);
      addWrapped(draft.merchantCity);
      if (draft.vatNumber) addWrapped(`P.IVA ${draft.vatNumber}`);
      if (draft.phone) addWrapped(draft.phone);
      addSectionSeparator("header");
      return;
    }

    if (section === "datetime") {
      addWrapped(`Ricevuta ${draft.receiptNumber}`);
      addWrapped(`${draft.issueDate}  ${draft.issueTime}`);
      addWrapped(`Cassa ${draft.cashier}`);
      addSectionSeparator("datetime");
      return;
    }

    if (section === "columns") {
      addWrapped(`${draft.columnsLeftLabel} / ${draft.columnsRightLabel}`);
      addSectionSeparator("columns");
      return;
    }

    if (section === "line-items") {
      draft.items.forEach((item) => {
        addWrapped(item.description);
        const detail = `${item.quantity} x ${item.unitPrice.toFixed(2)}  IVA ${item.vatRate}%`;
        addWrapped(detail);
        addWrapped(`Totale riga ${calculateLineTotal(item).toFixed(2)}`);
      });
      addSectionSeparator("line-items");
      return;
    }

    if (section === "vat-details") {
      vatBreakdown.forEach((row) => {
        addWrapped(`IVA ${row.rate}%  Imp. ${row.taxable.toFixed(2)}`);
        addWrapped(`Imposta ${row.vat.toFixed(2)}`);
      });
      addSectionSeparator("vat-details");
      return;
    }

    if (section === "payment") {
      addWrapped(`Subtotale ${summary.subtotal.toFixed(2)}`);
      if (draft.globalDiscount > 0) addWrapped(`Sconto extra -${draft.globalDiscount.toFixed(2)}`);
      if (draft.serviceFee > 0) addWrapped(`Servizio ${draft.serviceFee.toFixed(2)}`);
      addWrapped(`IVA ${summary.vatTotal.toFixed(2)}`);
      addWrapped(`Totale ${summary.grandTotal.toFixed(2)}`);
      addWrapped(`Pagamento ${draft.paymentMethod}`);
      addSectionSeparator("payment");
      return;
    }

    if (section === "custom-message") {
      if (draft.customMessage) addWrapped(draft.customMessage);
      if (draft.notes) addWrapped(draft.notes);
      if (draft.footerMessage) addWrapped(draft.footerMessage, draft.layout.headerAlignment);
      addSectionSeparator("custom-message");
      return;
    }

    if (section === "image" && draft.imageUrl) {
      addWrapped("[Immagine]");
      addWrapped(draft.imageUrl);
      addSectionSeparator("image");
      return;
    }

    if (section === "barcode" && draft.barcodeType === "barcode" && draft.barcodeValue) {
      addWrapped(`[BARCODE ${draft.barcodeValue}]`);
      if (draft.barcodeCaption) addWrapped(draft.barcodeCaption);
      addSectionSeparator("barcode");
      return;
    }

    if (section === "barcode" && draft.barcodeType === "qr-link" && draft.barcodeLink) {
      addWrapped("[QR CODE]");
      addWrapped(draft.barcodeLink);
      if (draft.barcodeCaption) addWrapped(draft.barcodeCaption);
      addSectionSeparator("barcode");
    }
  });

  return lines;
}
