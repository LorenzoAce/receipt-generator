import {
  deleteArchivedReceiptRecord,
  getArchivedReceiptById,
  requireDatabase,
  updateArchivedReceiptRecord,
  validatePayload,
} from "../_lib/archive.js";

export default async function handler(req, res) {
  if (!requireDatabase(res)) {
    return;
  }

  const { id } = req.query;

  if (typeof id !== "string" || id.trim().length === 0) {
    res.status(400).json({ error: "ID ricevuta non valido" });
    return;
  }

  if (req.method === "GET") {
    try {
      const receipt = await getArchivedReceiptById(id);

      if (!receipt) {
        res.status(404).json({ error: "Ricevuta non trovata" });
        return;
      }

      res.status(200).json(receipt);
    } catch (error) {
      res.status(500).json({
        error: "Errore nel caricamento ricevuta",
        message: error instanceof Error ? error.message : "Errore sconosciuto",
      });
    }

    return;
  }

  if (req.method === "PUT") {
    const validationError = validatePayload(req.body);

    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    try {
      const receipt = await updateArchivedReceiptRecord(id, req.body.name.trim(), req.body.draft);

      if (!receipt) {
        res.status(404).json({ error: "Ricevuta non trovata" });
        return;
      }

      res.status(200).json(receipt);
    } catch (error) {
      res.status(500).json({
        error: "Errore nell'aggiornamento ricevuta",
        message: error instanceof Error ? error.message : "Errore sconosciuto",
      });
    }

    return;
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await deleteArchivedReceiptRecord(id);

      if (!deleted) {
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

    return;
  }

  res.setHeader("Allow", "GET, PUT, DELETE");
  res.status(405).json({ error: "Metodo non consentito" });
}
