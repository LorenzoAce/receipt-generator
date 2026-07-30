const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "br",
  "div",
  "em",
  "i",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
]);

const BLOCK_TAGS = new Set(["div", "p", "ul", "ol", "li"]);
const ALLOWED_STYLES = new Set([
  "background-color",
  "color",
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "text-align",
  "text-decoration",
]);

function sanitizeInlineStyle(styleValue: string) {
  return styleValue
    .split(";")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .map((rule) => {
      const [property, ...valueParts] = rule.split(":");
      const normalizedProperty = property?.trim().toLowerCase();

      if (!normalizedProperty || !ALLOWED_STYLES.has(normalizedProperty)) {
        return null;
      }

      const value = valueParts.join(":").trim();

      if (!value || /url\s*\(|expression\s*\(/i.test(value)) {
        return null;
      }

      return `${normalizedProperty}: ${value}`;
    })
    .filter((rule): rule is string => Boolean(rule))
    .join("; ");
}

function sanitizeHref(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  if (/^(https?:|mailto:|tel:|\/)/i.test(normalized)) {
    return normalized;
  }

  return "";
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeNode(node: Node, documentRef: Document): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return documentRef.createTextNode(node.textContent ?? "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();

  if (tag === "script" || tag === "style") {
    return null;
  }

  if (!ALLOWED_TAGS.has(tag)) {
    const fragment = documentRef.createDocumentFragment();
    Array.from(element.childNodes).forEach((child) => {
      const sanitizedChild = sanitizeNode(child, documentRef);

      if (sanitizedChild) {
        fragment.appendChild(sanitizedChild);
      }
    });
    return fragment;
  }

  const cleanElement = documentRef.createElement(tag);

  if (tag === "a") {
    const href = sanitizeHref(element.getAttribute("href") ?? "");

    if (href) {
      cleanElement.setAttribute("href", href);
      cleanElement.setAttribute("target", "_blank");
      cleanElement.setAttribute("rel", "noreferrer noopener");
    }
  }

  const style = sanitizeInlineStyle(element.getAttribute("style") ?? "");
  if (style) {
    cleanElement.setAttribute("style", style);
  }

  Array.from(element.childNodes).forEach((child) => {
    const sanitizedChild = sanitizeNode(child, documentRef);

    if (sanitizedChild) {
      cleanElement.appendChild(sanitizedChild);
    }
  });

  return cleanElement;
}

export function sanitizeRichTextHtml(html: string) {
  const trimmed = html.trim();

  if (!trimmed) {
    return "";
  }

  if (typeof DOMParser === "undefined") {
    return escapeHtml(trimmed).replace(/\n/g, "<br>");
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const container = parsed.body.firstElementChild;

  if (!container) {
    return "";
  }

  const outputDocument = document.implementation.createHTMLDocument("");
  const outputContainer = outputDocument.createElement("div");

  Array.from(container.childNodes).forEach((child) => {
    const sanitizedChild = sanitizeNode(child, outputDocument);

    if (sanitizedChild) {
      outputContainer.appendChild(sanitizedChild);
    }
  });

  let result = outputContainer.innerHTML
    .replace(/<div><br><\/div>/gi, "<br>")
    .replace(/<(div|p)>\s*<\/\1>/gi, "<br>")
    .trim();

  if (!result) {
    return "";
  }

  if (!/[<][a-z/!]/i.test(result)) {
    result = escapeHtml(result).replace(/\n/g, "<br>");
  }

  return result;
}

export function richTextHtmlToPlainText(html: string) {
  if (!html.trim()) {
    return "";
  }

  if (typeof DOMParser === "undefined") {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(div|p|li|ul|ol)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .trim();
  }

  const sanitized = sanitizeRichTextHtml(html);
  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${sanitized}</div>`, "text/html");
  const lines: string[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      lines.push(node.textContent ?? "");
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();

    if (tag === "br") {
      lines.push("\n");
      return;
    }

    Array.from(element.childNodes).forEach(walk);

    if (BLOCK_TAGS.has(tag)) {
      lines.push("\n");
    }
  };

  Array.from(parsed.body.firstElementChild?.childNodes ?? []).forEach(walk);

  return lines
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
