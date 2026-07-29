import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  createArchivedReceiptRecord,
  deleteArchivedReceiptRecord,
  ensureSchema,
  getArchivedReceiptById,
  hasDatabase,
  listArchivedReceipts,
  requireDatabase,
  updateArchivedReceiptRecord,
  validatePayload,
} from "./_lib/archive.js";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", async (_req, res) => {
  res.json({
    ok: true,
    databaseConfigured: hasDatabase(),
  });
});

app.get("/api/receipts", async (_req, res) => {
  if (!requireDatabase(res)) {
    return;
  }

  try {
    const rows = await listArchivedReceipts();
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: "Errore nel recupero archivio",
      message: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  }
});

app.get("/api/receipts/:id", async (req, res) => {
  if (!requireDatabase(res)) {
    return;
  }

  try {
    const receipt = await getArchivedReceiptById(req.params.id);

    if (!receipt) {
      res.status(404).json({ error: "Ricevuta non trovata" });
      return;
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({
      error: "Errore nel caricamento ricevuta",
      message: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  }
});

app.post("/api/receipts", async (req, res) => {
  if (!requireDatabase(res)) {
    return;
  }

  const validationError = validatePayload(req.body);

  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  try {
    const name = req.body.name.trim();
    const draft = req.body.draft;
    const receipt = await createArchivedReceiptRecord(name, draft);

    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({
      error: "Errore nel salvataggio ricevuta",
      message: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  }
});

app.put("/api/receipts/:id", async (req, res) => {
  if (!requireDatabase(res)) {
    return;
  }

  const validationError = validatePayload(req.body);

  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  try {
    const name = req.body.name.trim();
    const draft = req.body.draft;
    const receipt = await updateArchivedReceiptRecord(req.params.id, name, draft);

    if (!receipt) {
      res.status(404).json({ error: "Ricevuta non trovata" });
      return;
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({
      error: "Errore nell'aggiornamento ricevuta",
      message: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  }
});

app.delete("/api/receipts/:id", async (req, res) => {
  if (!requireDatabase(res)) {
    return;
  }

  try {
    const receipt = await deleteArchivedReceiptRecord(req.params.id);

    if (!receipt) {
      res.status(404).json({ error: "Ricevuta non trovata" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: "Errore nella cancellazione ricevuta",
      message: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  }
});

app.listen(port, async () => {
  try {
    await ensureSchema();
  } catch (error) {
    console.error("Neon schema bootstrap failed:", error);
  }

  console.log(`Receipt archive API listening on http://127.0.0.1:${port}`);
});
