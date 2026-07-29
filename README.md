# Receipt Generator

Web app React + TypeScript + Vite per creare, visualizzare e stampare ricevute termiche da `80mm` e `62mm`.

## Archivio Neon

L'app include ora un archivio CRUD collegabile a Neon:
- salva una ricevuta
- aggiorna una ricevuta esistente
- carica una ricevuta nell'editor
- elimina una ricevuta

### Configurazione

1. Crea un file `.env` partendo da `.env.example`
2. Inserisci la tua `DATABASE_URL` di Neon
3. Se vuoi, esegui in Neon lo script [neon/receipt-archive.sql](file:///c:/Users/acerb/OneDrive/Desktop/web-app/receipt-generator/neon/receipt-archive.sql)

### Avvio locale

```bash
npm install
npm run dev
```

`npm run dev` avvia insieme:
- frontend Vite
- API locale Express su `http://127.0.0.1:8787`

Il frontend usa il proxy Vite su `/api`, quindi l'archivio funziona senza esporre la connessione Neon nel browser.
