import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReceiptPreview } from "./ReceiptPreview";
import { createBuilderSection, createDefaultDraft, createFreeTextBlock } from "../utils/receipt";

describe("ReceiptPreview", () => {
  it("mostra uno scontrino vuoto senza footer automatico quando non ci sono sezioni", () => {
    const draft = createDefaultDraft();

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} />);

    expect(screen.queryByText("Pronto per stampa")).not.toBeInTheDocument();
    expect(screen.queryByText("Grazie per aver acquistato con noi.")).not.toBeInTheDocument();
    expect(document.querySelector(".printable-ticket")).toBeInTheDocument();
  });

  it("mostra intestazione e totale nell'anteprima", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [
      createBuilderSection("header", "header"),
      createBuilderSection("line-items", "items"),
      createBuilderSection("payment", "payment"),
    ];
    draft.sectionSeparators = { header: "equals", items: "equals", payment: "equals" };

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} />);

    expect(screen.getByText("Bottega Aurora")).toBeInTheDocument();
    expect(screen.getByText("P.IVA IT12345678901")).toBeInTheDocument();
    expect(screen.getAllByText(/^Totale$/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Pagamento")).toBeInTheDocument();
    expect(screen.getByText("12,86 EUR")).toBeInTheDocument();
  });

  it("mostra un QR code quando la sezione barcode usa un link", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [createBuilderSection("barcode", "barcode")];
    draft.sectionSeparators = { barcode: "equals" };
    draft.barcodeType = "qr-link";
    draft.barcodeLink = "https://example.com/ricevuta/123";
    draft.qrShape = "rounded";
    draft.qrSize = 132;
    draft.barcodeCaption = "Apri ricevuta";

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} />);

    const qrImage = screen.getByAltText("QR code da link");

    expect(qrImage).toBeInTheDocument();
    expect(qrImage).toHaveStyle({ width: "132px", height: "132px", borderRadius: "22px" });
    expect(screen.getByText("https://example.com/ricevuta/123")).toBeInTheDocument();
    expect(screen.getByText("Apri ricevuta")).toBeInTheDocument();
  });

  it("mostra il testo libero con stile personalizzato", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [createBuilderSection("free-text", "free-1")];
    draft.freeTextBlocks = [
      createFreeTextBlock("free-1", {
        content: '<div><span style="font-family: Georgia; font-size: 26px; font-style: italic;">Testo libero</span><br/>incollato</div>',
        fontSize: 24,
        alignment: "center",
        letterSpacing: 1.6,
      }),
    ];
    draft.sectionSeparators = { "free-1": "equals" };

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} />);

    const freeText = screen.getByLabelText("Sezione anteprima Testo libero");
    const styledText = screen.getByText("Testo libero");
    const freeTextContainer = styledText.closest("div.min-h-14");

    expect(freeText).toBeInTheDocument();
    expect(freeText).toHaveTextContent("Testo libero");
    expect(freeText).toHaveTextContent("incollato");
    expect(freeTextContainer).toHaveStyle({ fontSize: "24px", letterSpacing: "1.6px" });
    expect(freeTextContainer).toHaveClass("text-center");
    expect(styledText).toHaveStyle({ fontFamily: "Georgia", fontSize: "26px", fontStyle: "italic" });
  });

  it("applica lo spazio verticale della singola sezione", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [createBuilderSection("header", "header"), createBuilderSection("payment", "payment")];
    draft.sectionSeparators = { header: "equals", payment: "equals" };
    draft.sectionSpacing = { header: 34, payment: 12 };

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} />);

    expect(screen.getByLabelText("Sezione anteprima Intestazione")).toHaveStyle({ marginBottom: "34px" });
  });

  it("rispetta l'ordine delle sezioni nell'anteprima", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [createBuilderSection("payment", "payment"), createBuilderSection("header", "header")];
    draft.sectionSeparators = { payment: "equals", header: "equals" };

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} />);

    const paymentSection = screen.getByLabelText("Sezione anteprima Pagamento");
    const headerSection = screen.getByLabelText("Sezione anteprima Intestazione");

    expect(paymentSection.compareDocumentPosition(headerSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("chiama il riordino quando trascini una sezione nell'anteprima", () => {
    const draft = createDefaultDraft();
    draft.builderSections = [createBuilderSection("header", "header"), createBuilderSection("payment", "payment")];
    draft.sectionSeparators = { header: "equals", payment: "equals" };
    const onMoveSection = vi.fn();

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} onMoveSection={onMoveSection} />);

    fireEvent.dragStart(screen.getByLabelText("Trascina Intestazione nell'anteprima"));
    fireEvent.dragOver(screen.getByLabelText("Sezione anteprima Pagamento"));
    fireEvent.drop(screen.getByLabelText("Sezione anteprima Pagamento"));

    expect(onMoveSection).toHaveBeenCalledWith("header", "payment");
  });
});
