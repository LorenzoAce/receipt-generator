import {
  buildReceiptLines,
  calculateSummary,
  createBuilderSection,
  createDefaultDraft,
  createFreeTextBlock,
  normalizeDraft,
  reorderBuilderSections,
} from "./receipt";

describe("receipt helpers", () => {
  it("calcola correttamente subtotale IVA e totale", () => {
    const draft = createDefaultDraft();
    draft.globalDiscount = 1;
    draft.serviceFee = 2;

    const summary = calculateSummary(draft);

    expect(summary.subtotal).toBeCloseTo(12, 5);
    expect(summary.vatTotal).toBeCloseTo(0.864, 3);
    expect(summary.grandTotal).toBeCloseTo(13.864, 3);
    expect(summary.itemDiscounts).toBeCloseTo(1.5, 5);
  });

  it("genera linee compatibili con il formato stretto", () => {
    const draft = createDefaultDraft();
    draft.paperWidth = "62mm";
    draft.builderSections = [
      createBuilderSection("header", "header"),
      createBuilderSection("datetime", "datetime"),
      createBuilderSection("columns", "columns"),
      createBuilderSection("line-items", "line-items"),
      createBuilderSection("payment", "payment"),
    ];
    draft.sectionSeparators = {
      header: "equals",
      datetime: "equals",
      columns: "equals",
      "line-items": "equals",
      payment: "equals",
    };

    const lines = buildReceiptLines(draft);

    expect(lines.length).toBeGreaterThan(10);
    expect(lines.some((line) => line.includes("Ricevuta"))).toBe(true);
    expect(lines.every((line) => line.length <= 24)).toBe(true);
  });

  it("normalizza correttamente una bozza salvata con campi mancanti", () => {
    const draft = normalizeDraft({
      merchantName: "Test Shop",
      layout: {
        textOpacity: 50,
      } as any,
    });

    expect(draft.merchantName).toBe("Test Shop");
    expect(draft.layout.currencyDisplay).toBe("value-space-symbol");
    expect(draft.layout.sectionSpacing).toBe(20);
    expect(draft.builderSections).toEqual([]);
    expect(draft.sectionSpacing).toEqual({});
    expect(draft.columnsLeftLabel).toBe("Articolo");
    expect(draft.barcodeType).toBe("barcode");
    expect(draft.barcodeLink).toContain("https://");
    expect(draft.qrShape).toBe("square");
    expect(draft.qrSize).toBe(160);
    expect(draft.freeTextBlocks).toEqual([]);
  });

  it("riordina le sezioni del builder quando trascinate", () => {
    const reordered = reorderBuilderSections(
      [
        createBuilderSection("header", "header"),
        createBuilderSection("datetime", "datetime"),
        createBuilderSection("payment", "payment"),
        createBuilderSection("barcode", "barcode"),
      ],
      "barcode",
      "datetime",
    );

    expect(reordered.map((section) => section.type)).toEqual(["header", "barcode", "datetime", "payment"]);
  });

  it("genera linee testo per QR code da link", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [createBuilderSection("barcode", "barcode")];
    draft.sectionSeparators = { barcode: "equals" };
    draft.barcodeType = "qr-link";
    draft.barcodeLink = "https://example.com/r/456";

    const lines = buildReceiptLines(draft);

    expect(lines.some((line) => line.includes("[QR CODE]"))).toBe(true);
    expect(lines.some((line) => line.includes("https://example.com/r/456"))).toBe(true);
  });

  it("genera linee testo per la sezione testo libero", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [createBuilderSection("free-text", "free-1")];
    draft.paperWidth = "62mm";
    draft.freeTextBlocks = [
      createFreeTextBlock("free-1", {
        content: "<div><strong>Prima riga</strong></div><div>Testo molto lungo da spezzare nel formato stretto</div>",
        alignment: "right",
      }),
    ];
    draft.sectionSeparators = { "free-1": "equals" };

    const lines = buildReceiptLines(draft);

    expect(lines.some((line) => line.includes("Prima riga"))).toBe(true);
    expect(lines.some((line) => line.includes("Testo molto lungo"))).toBe(true);
    expect(lines.every((line) => line.length <= 24)).toBe(true);
  });

  it("rispetta l'ordine delle builderSections nelle linee esportate", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [createBuilderSection("payment", "payment"), createBuilderSection("header", "header")];
    draft.sectionSeparators = { payment: "equals", header: "equals" };

    const lines = buildReceiptLines(draft);
    const totalIndex = lines.findIndex((line) => line.includes("Totale"));
    const merchantIndex = lines.findIndex((line) => line.includes("Bottega Aurora"));

    expect(totalIndex).toBeGreaterThan(-1);
    expect(merchantIndex).toBeGreaterThan(-1);
    expect(totalIndex).toBeLessThan(merchantIndex);
  });
});
