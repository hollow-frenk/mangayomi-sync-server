# Mangayomi Sync Server

Server di sincronizzazione per Mangayomi.

## Requisiti di sviluppo
- **Node.js** >= 18 (consigliato l'ultima LTS)
- **npm** >= 9
- **Docker** e **Docker Compose** (opzionale, solo per test/avvio containerizzato)
- **Typescript** (installato come devDependency)
- **Sistema operativo**: macOS, Linux o Windows

## Variabili d'ambiente principali
- `JWT_SECRET_KEY`: chiave segreta per la firma dei token JWT
- `JWT_EXPIRATION_DAYS`: giorni di validità del token (default: 365)
- `DATABASE_URI`: stringa di connessione al database

## Endpoints principali
- `POST /login`: ottieni un token JWT
- `GET /check`: verifica hash backup
- `POST /sync`: sincronizza dati
- `POST /upload/full`: upload backup completo
- `GET /download`: scarica backup

## Setup ambiente di sviluppo

1. Clona la repository:
   ```bash
   git clone <url-repo>
   cd mangayomi-sync-server
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Per la scrittura di codice TypeScript, puoi usare qualsiasi editor, ma è consigliato **VS Code** con le estensioni:
   - ESLint
   - Prettier
   - TypeScript
4. Per avviare il server in sviluppo:
   ```bash
   npm run build && npm start
   ```
   Oppure, per sviluppo rapido:
   ```bash
   npx tsc --watch
   # In un altro terminale
   npm start
   ```
5. Per testare la build Docker:
   ```bash
   docker compose up --build
   ```

## Convenzioni e consigli per contribuire
- Segui la struttura delle cartelle già presente (`src/`, `model/`, `migration/`, ecc.)
- Scrivi codice tipizzato e usa le interfacce/DTO già esistenti
- Prima di aprire una PR, assicurati che il progetto compili senza errori (`npm run build`)
- Se aggiungi nuove dipendenze, aggiorna anche il file `package.json`
- Se modifichi la struttura dei dati, aggiorna la documentazione e i tipi
- Per domande o dubbi, apri una issue

## Avvio con Docker Compose

Per utilizzare il server tramite Docker Compose:

1. Assicurati di aver sincronizzato la repository in locale (tramite `git pull` o scaricando l'ultima versione).
2. Apri il terminale nella cartella dove è presente il codice della repo sincronizzata.
3. Esegui il comando:

```bash
docker compose up --build
```

Per ogni nuova release, dopo aver sincronizzato la repository, esegui:

```bash
COMPOSE_BAKE=true docker compose build && docker compose down && docker compose up -d
```

Questo comando ricostruirà le immagini Docker e riavvierà i servizi con la versione aggiornata del codice.

## Avvio senza Docker (modalità locale)

Per utilizzare il server in locale

1. Installa Node.js (>= 18) e npm (>= 9) sul tuo sistema.
2. Assicurati di aver sincronizzato la repository in locale (tramite `git pull` o scaricando l'ultima versione).
3. Apri il terminale nella cartella dove è presente il codice della repo sincronizzata.
4. Installa le dipendenze del progetto:
   ```bash
   npm install
   ```
5. Configura le variabili d'ambiente (puoi copiare e modificare il file `.env` o `env-docker` secondo le tue esigenze).
6. Compila il progetto TypeScript:
   ```bash
   npm run build
   ```
7. Avvia il server:
   ```bash
   npm start
   ```

Il server sarà disponibile sulla porta specificata nella variabile d'ambiente `PORT` (default: 3000).

---

Contribuito da hollow_frenk
