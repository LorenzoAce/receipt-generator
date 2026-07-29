import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 8787);
const databaseUrl = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

let schemaReady = false;

function getSql() {
  if (!databaseUrl) {
    return null;
  }

  return neon(databaseUrl);
}

async function ensureSchema() {
  if (schemaReady) {
    return;
  }

  const sql = getSql();

  if (!sql) {
    return;
  }

  await sql`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS receipt_archives (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      paper_width TEXT NOT NULL,
      template_id TEXT NOT NULL,
      draft_json JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  schemaReady = true;
}

function requireDatabase(res) {
  if (databaseUrl) {
    return true;
  }

  res.status(503).json({
    error: "DATABASE_URL mancante",
    message: "Imposta DATABASE_URL nel file .env per abilitare l'archivio Neon.",
  });

  return false;
}

function validatePayload(body) {
  if (!body || typeof body !== "object") {
    return "Payload non valido.";
  }

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return "Il nome della ricevuta e obbligatorio.";
  }

  if (!body.draft || typeof body.draft !== "object" || Array.isArray(body.draft)) {
    return "La bozza della ricevuta e obbligatoria.";
  }

  return null;
}

app.get("/api/health", async (_req, res) => {
  res.json({
    ok: true,
    databaseConfigured: Boolean(databaseUrl),
    schemaReady,
  });
});

app.get("/api/receipts", async (_req, res) => {
  if (!requireDatabase(res)) {
    return;
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`
      SELECT
        id,
        name,
        paper_width AS "paperWidth",
        template_id AS "templateId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM receipt_archives
      ORDER BY updated_at DESC;
    `;

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
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`
      SELECT
        id,
        name,
        paper_width AS "paperWidth",
        template_id AS "templateId",
        draft_json AS draft,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM receipt_archives
      WHERE id = ${req.params.id}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      res.status(404).json({ error: "Ricevuta non trovata" });
      return;
    }

    res.json(rows[0]);
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
    await ensureSchema();
    const sql = getSql();
    const name = req.body.name.trim();
    const draft = req.body.draft;

    const rows = await sql`
      INSERT INTO receipt_archives (name, paper_width, template_id, draft_json)
      VALUES (
        ${name},
        ${draft.paperWidth ?? "80mm"},
        ${draft.templateId ?? "custom"},
        ${JSON.stringify(draft)}::jsonb
      )
      RETURNING
        id,
        name,
        paper_width AS "paperWidth",
        template_id AS "templateId",
        created_at AS "createdAt",
        updated_at AS "updatedAt";
    `;

    res.status(201).json(rows[0]);
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
    await ensureSchema();
    const sql = getSql();
    const name = req.body.name.trim();
    const draft = req.body.draft;

    const rows = await sql`
      UPDATE receipt_archives
      SET
        name = ${name},
        paper_width = ${draft.paperWidth ?? "80mm"},
        template_id = ${draft.templateId ?? "custom"},
        draft_json = ${JSON.stringify(draft)}::jsonb,
        updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING
        id,
        name,
        paper_width AS "paperWidth",
        template_id AS "templateId",
        created_at AS "createdAt",
        updated_at AS "updatedAt";
    `;

    if (rows.length === 0) {
      res.status(404).json({ error: "Ricevuta non trovata" });
      return;
    }

    res.json(rows[0]);
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
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`
      DELETE FROM receipt_archives
      WHERE id = ${req.params.id}
      RETURNING id;
    `;

    if (rows.length === 0) {
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
