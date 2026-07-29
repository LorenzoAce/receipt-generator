import type { ReceiptDraft } from "../utils/receipt";

export type ArchivedReceiptSummary = {
  id: string;
  name: string;
  paperWidth: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
};

export type ArchivedReceiptDetail = ArchivedReceiptSummary & {
  draft: ReceiptDraft;
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
  throw new Error(payload?.message || payload?.error || "Richiesta archivio non riuscita.");
}

export async function fetchArchivedReceipts() {
  const response = await fetch("/api/receipts");
  return parseApiResponse<ArchivedReceiptSummary[]>(response);
}

export async function fetchArchivedReceipt(id: string) {
  const response = await fetch(`/api/receipts/${id}`);
  return parseApiResponse<ArchivedReceiptDetail>(response);
}

export async function createArchivedReceipt(name: string, draft: ReceiptDraft) {
  const response = await fetch("/api/receipts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, draft }),
  });

  return parseApiResponse<ArchivedReceiptSummary>(response);
}

export async function updateArchivedReceipt(id: string, name: string, draft: ReceiptDraft) {
  const response = await fetch(`/api/receipts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, draft }),
  });

  return parseApiResponse<ArchivedReceiptSummary>(response);
}

export async function deleteArchivedReceipt(id: string) {
  const response = await fetch(`/api/receipts/${id}`, {
    method: "DELETE",
  });

  return parseApiResponse<void>(response);
}
