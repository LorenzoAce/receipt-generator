import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReceiptPreview } from "./ReceiptPreview";
import { createDefaultDraft } from "../utils/receipt";

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
    draft.builderSections = ["header", "line-items", "payment"];

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} />);

    expect(screen.getByText("Bottega Aurora")).toBeInTheDocument();
    expect(screen.getByText("P.IVA IT12345678901")).toBeInTheDocument();
    expect(screen.getAllByText(/^Totale$/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Pagamento")).toBeInTheDocument();
    expect(screen.getByText("12,86 EUR")).toBeInTheDocument();
  });

  it("mostra un QR code quando la sezione barcode usa un link", () => {
    const draft = createDefaultDraft();
    draft.builderSections = ["barcode"];
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

  it("rispetta l'ordine delle sezioni nell'anteprima", () => {
    const draft = createDefaultDraft();
    draft.builderSections = ["payment", "header"];

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} />);

    const paymentSection = screen.getByLabelText("Sezione anteprima Pagamento");
    const headerSection = screen.getByLabelText("Sezione anteprima Intestazione");

    expect(paymentSection.compareDocumentPosition(headerSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("chiama il riordino quando trascini una sezione nell'anteprima", () => {
    const draft = createDefaultDraft();
    draft.builderSections = ["header", "payment"];
    const onMoveSection = vi.fn();

    render(<ReceiptPreview ref={createRef<HTMLDivElement>()} draft={draft} onMoveSection={onMoveSection} />);

    fireEvent.dragStart(screen.getByLabelText("Trascina Intestazione nell'anteprima"));
    fireEvent.dragOver(screen.getByLabelText("Sezione anteprima Pagamento"));
    fireEvent.drop(screen.getByLabelText("Sezione anteprima Pagamento"));

    expect(onMoveSection).toHaveBeenCalledWith("header", "payment");
  });
});
