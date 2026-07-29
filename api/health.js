import { ensureSchema, hasDatabase } from "./_lib/archive.js";

export default async function handler(_req, res) {
  try {
    await ensureSchema();

    res.status(200).json({
      ok: true,
      databaseConfigured: hasDatabase(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Errore health check",
      message: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  }
}
