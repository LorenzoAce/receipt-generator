import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { PAPER_SPECS, type ReceiptDraft } from "./receipt";

function cloneReceiptNode(source: HTMLElement) {
  const clonedNode = source.cloneNode(true) as HTMLElement;
  clonedNode.querySelectorAll(".no-print").forEach((node) => node.remove());
  clonedNode.style.width = `${source.getBoundingClientRect().width}px`;
  clonedNode.style.minWidth = `${source.getBoundingClientRect().width}px`;
  clonedNode.style.maxWidth = `${source.getBoundingClientRect().width}px`;
  clonedNode.style.margin = "0";
  clonedNode.style.boxShadow = "none";
  clonedNode.style.border = "0";
  clonedNode.style.borderRadius = "0";
  clonedNode.style.background = "white";
  clonedNode.style.overflow = "visible";

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-100000px";
  wrapper.style.top = "0";
  wrapper.style.padding = "0";
  wrapper.style.margin = "0";
  wrapper.style.background = "white";
  wrapper.style.zIndex = "-1";
  wrapper.appendChild(clonedNode);

  return { wrapper, clonedNode };
}

export async function exportReceiptPdf(draft: ReceiptDraft, previewElement: HTMLElement | null) {
  if (!previewElement) {
    throw new Error("Anteprima non disponibile per l'esportazione PDF.");
  }

  const paperSpec = PAPER_SPECS[draft.paperWidth];
  const { wrapper, clonedNode } = cloneReceiptNode(previewElement);
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(clonedNode, {
      backgroundColor: "#ffffff",
      scale: Math.max(window.devicePixelRatio || 1, 2),
      useCORS: true,
      logging: false,
    });

    const imageData = canvas.toDataURL("image/png");
    const pageHeight = (canvas.height / canvas.width) * paperSpec.widthMm;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageHeight, paperSpec.widthMm],
    });

    pdf.addImage(imageData, "PNG", 0, 0, paperSpec.widthMm, pageHeight, undefined, "FAST");
    pdf.save(`ricevuta-${draft.receiptNumber || "bozza"}.pdf`);
  } finally {
    wrapper.remove();
  }
}
