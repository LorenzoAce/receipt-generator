import { neon } from "@neondatabase/serverless";

let schemaReady = false;

function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

export function hasDatabase() {
  return Boolean(getDatabaseUrl());
}

export function getSql() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return null;
  }

  return neon(databaseUrl);
}

export async function ensureSchema() {
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

export function requireDatabase(res) {
  if (hasDatabase()) {
    return true;
  }

  res.status(503).json({
    error: "DATABASE_URL mancante",
    message: "Imposta DATABASE_URL nell'ambiente di deploy per abilitare l'archivio Neon.",
  });

  return false;
}

export function validatePayload(body) {
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

export async function listArchivedReceipts() {
  await ensureSchema();
  const sql = getSql();

  return sql`
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
}

export async function getArchivedReceiptById(id) {
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
    WHERE id = ${id}
    LIMIT 1;
  `;

  return rows[0] ?? null;
}

export async function createArchivedReceiptRecord(name, draft) {
  await ensureSchema();
  const sql = getSql();

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

  return rows[0];
}

export async function updateArchivedReceiptRecord(id, name, draft) {
  await ensureSchema();
  const sql = getSql();

  const rows = await sql`
    UPDATE receipt_archives
    SET
      name = ${name},
      paper_width = ${draft.paperWidth ?? "80mm"},
      template_id = ${draft.templateId ?? "custom"},
      draft_json = ${JSON.stringify(draft)}::jsonb,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING
      id,
      name,
      paper_width AS "paperWidth",
      template_id AS "templateId",
      created_at AS "createdAt",
      updated_at AS "updatedAt";
  `;

  return rows[0] ?? null;
}

export async function deleteArchivedReceiptRecord(id) {
  await ensureSchema();
  const sql = getSql();

  const rows = await sql`
    DELETE FROM receipt_archives
    WHERE id = ${id}
    RETURNING id;
  `;

  return rows[0] ?? null;
}
