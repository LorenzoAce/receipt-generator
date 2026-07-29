import { jsPDF } from "jspdf";
import { PAPER_SPECS, type ReceiptDraft, buildReceiptLines } from "./receipt";

export function exportReceiptPdf(draft: ReceiptDraft) {
  const paperSpec = PAPER_SPECS[draft.paperWidth];
  const lines = buildReceiptLines(draft);
  const lineHeight = 3.8;
  const marginX = 4;
  const marginY = 6;
  const pageHeight = Math.max(120, marginY * 2 + lines.length * lineHeight + 8);

  const document = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pageHeight, paperSpec.widthMm],
  });

  document.setFont("courier", "normal");
  document.setFontSize(draft.paperWidth === "80mm" ? 9 : 8);

  lines.forEach((line, index) => {
    document.text(line, marginX, marginY + index * lineHeight);
  });

  document.save(`ricevuta-${draft.receiptNumber || "bozza"}.pdf`);
}
