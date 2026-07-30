import { sanitizeRichTextHtml } from "./richText";

describe("richText helpers", () => {
  it("mantiene il font-size inline ma rimuove line-height incollati che comprimono le righe", () => {
    const sanitized = sanitizeRichTextHtml(
      '<div><span style="font-size: 42px; line-height: 0.7; font-family: Cambria;">IMPORTO MANUALE</span></div>',
    );

    expect(sanitized).toContain("font-size: 42px");
    expect(sanitized).not.toContain("line-height");
  });
});
