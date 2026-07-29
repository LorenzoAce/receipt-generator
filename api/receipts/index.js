import {
  createArchivedReceiptRecord,
  listArchivedReceipts,
  requireDatabase,
  validatePayload,
} from "../_lib/archive.js";

export default async function handler(req, res) {
  if (!requireDatabase(res)) {
    return;
  }

  if (req.method === "GET") {
    try {
      const receipts = await listArchivedReceipts();
      res.status(200).json(receipts);
    } catch (error) {
      res.status(500).json({
        error: "Errore nel recupero archivio",
        message: error instanceof Error ? error.message : "Errore sconosciuto",
      });
    }

    return;
  }

  if (req.method === "POST") {
    const validationError = validatePayload(req.body);

    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    try {
      const receipt = await createArchivedReceiptRecord(req.body.name.trim(), req.body.draft);
      res.status(201).json(receipt);
    } catch (error) {
      res.status(500).json({
        error: "Errore nel salvataggio ricevuta",
        message: error instanceof Error ? error.message : "Errore sconosciuto",
      });
    }

    return;
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).json({ error: "Metodo non consentito" });
}
