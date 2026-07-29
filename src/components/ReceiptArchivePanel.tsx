import { useEffect, useMemo, useState } from "react";
import { Database, Download, LoaderCircle, RefreshCw, Save, Trash2 } from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";
import {
  createArchivedReceipt,
  deleteArchivedReceipt,
  fetchArchivedReceipt,
  fetchArchivedReceipts,
  type ArchivedReceiptSummary,
  updateArchivedReceipt,
} from "../lib/receiptArchiveApi";
import { cn } from "../lib/utils";
import type { ReceiptDraft } from "../utils/receipt";

type ReceiptArchivePanelProps = {
  draft: ReceiptDraft;
  onApplyDraft: (draft: ReceiptDraft) => void;
};

function formatArchiveDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ReceiptArchivePanel({ draft, onApplyDraft }: ReceiptArchivePanelProps) {
  const [receipts, setReceipts] = useState<ArchivedReceiptSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [archiveName, setArchiveName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suggestedName = useMemo(() => {
    const fallbackDate = draft.issueDate || new Date().toISOString().slice(0, 10);
    return `${draft.title || "Ricevuta"} - ${fallbackDate}`;
  }, [draft.issueDate, draft.title]);

  const loadArchive = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rows = await fetchArchivedReceipts();
      setReceipts(rows);

      if (selectedId && !rows.some((row) => row.id === selectedId)) {
        setSelectedId(null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Impossibile leggere l'archivio.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadArchive();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const saved = await createArchivedReceipt(archiveName.trim() || suggestedName, draft);
      setSelectedId(saved.id);
      setArchiveName(saved.name);
      setMessage("Ricevuta salvata nell'archivio.");
      await loadArchive();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Salvataggio non riuscito.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      setError("Seleziona prima una ricevuta da aggiornare.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await updateArchivedReceipt(selectedId, archiveName.trim() || suggestedName, draft);
      setArchiveName(updated.name);
      setMessage("Ricevuta aggiornata correttamente.");
      await loadArchive();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Aggiornamento non riuscito.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async (id: string) => {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const archived = await fetchArchivedReceipt(id);
      setSelectedId(archived.id);
      setArchiveName(archived.name);
      onApplyDraft(archived.draft);
      setMessage("Ricevuta caricata dall'archivio.");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Caricamento non riuscito.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const target = receipts.find((receipt) => receipt.id === id);

    if (!window.confirm(`Vuoi eliminare "${target?.name ?? "questa ricevuta"}" dall'archivio?`)) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await deleteArchivedReceipt(id);

      if (selectedId === id) {
        setSelectedId(null);
        setArchiveName("");
      }

      setMessage("Ricevuta eliminata dall'archivio.");
      await loadArchive();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Eliminazione non riuscita.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CollapsibleCard title="Archivio" icon={Database} defaultOpen contentClassName="space-y-4 px-5 pb-5">
      <div className="space-y-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Nome ricevuta</span>
          <input
            type="text"
            value={archiveName}
            placeholder={suggestedName}
            onChange={(event) => setArchiveName(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500/20"
          />
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Salva il draft corrente su Neon, poi potrai ricaricarlo, aggiornarlo o eliminarlo dall'archivio.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salva
        </button>
        <button
          type="button"
          onClick={() => void handleUpdate()}
          disabled={isSaving || !selectedId}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition duration-200 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className="h-4 w-4" />
          Aggiorna
        </button>
        <button
          type="button"
          onClick={() => void loadArchive()}
          disabled={isSaving || isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/60 dark:hover:bg-slate-800"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Aggiorna elenco
        </button>
      </div>

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Caricamento archivio in corso...
          </div>
        ) : receipts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Nessuna ricevuta salvata. Quando inserirai la `DATABASE_URL` di Neon, qui vedrai il tuo archivio.
          </div>
        ) : (
          receipts.map((receipt) => {
            const isSelected = receipt.id === selectedId;

            return (
              <article
                key={receipt.id}
                className={cn(
                  "rounded-2xl border px-4 py-4 transition duration-200",
                  isSelected ? "border-blue-200 bg-blue-50/70 dark:border-blue-500/50 dark:bg-blue-500/10" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(receipt.id);
                        setArchiveName(receipt.name);
                      }}
                      className="text-left text-sm font-semibold text-slate-800 dark:text-slate-100"
                    >
                      {receipt.name}
                    </button>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {receipt.paperWidth} · {receipt.templateId} · aggiornato {formatArchiveDate(receipt.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void handleLoad(receipt.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/60 dark:hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Carica
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(receipt.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition duration-200 hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Elimina
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </CollapsibleCard>
  );
}
