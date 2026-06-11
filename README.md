# Real TV Time Simulator

Progetto realizzato per il corso di Fondamenti Web.

**Real TV Time Simulator** è un'applicazione web full-stack (MERN) che permette agli utenti di esplorare i film consigliati creando una propria bacheca di film preferiti.


**Live Demo:** [real-tv-time-simulator.onrender.com](https://real-tv-time-simulator.onrender.com/)

## Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Realtime:** Socket.io 
- **Deployment & Containerizzazione:** Render, Docker, Docker Compose

## Variabili d'ambiente

Per il corretto funzionamento dell'applicazione in locale o in ambiente containerizzato, è necessario configurare due file `.env`.

### 1. Backend Config (`backend/.env`)
Crea un file chiamato `.env` all'interno della cartella `backend/`:

`PORT` --> Porta su cui rimarrà in ascolto il server Node.js (`5000`)
`MONGODB_URI` --> Stringa di connessione al database MongoDB (`mongodb+srv://...`)
`JWT_SECRET` -->Chiave segreta utilizzata per firmare i JSON Web Token (`chiave_arbitraria`)
`NODE_ENV` --> Ambiente di esecuzione dell'applicazione (`development` o `production`)

### 2. Frontend Config (`frontend/.env`)
Crea un file chiamato `.env` all'interno della cartella `frontend/`:

`VITE_API_URL` --> Endpoint di base del backend per le chiamate API e l'handshake di Socket.IO (`http://localhost:5000`)
`VITE_TMDB_API_KEY` --> Chiave API personale per autenticare le richieste verso l'API di The Movie Database (`3a1b2c...`)


---


## Avvio del Progetto (in Locale):
È possibile eseguire l'applicazione in due modalità: tramite l'ambiente di sviluppo locale (Node/Vite installati sulla macchina) o isolandola tramite Docker.

### Opzione A: Avvio con Docker (Consigliato)
Il progetto include una configurazione multi-container tramite Docker Compose che automatizza l'installazione delle dipendenze e la gestione dei servizi.

1.  **Costruzione dei container e primo avvio:**
    ```bash
    docker compose up --build
    ```
2.  **Avvii successivi (senza modifiche ai pacchetti):**
    ```bash
    docker compose up
    ```
3.  **Spegnimento e pulizia della rete Docker:**
    ```bash
    docker compose down
    ```

### Opzione B: Sviluppo Locale Tradizionale


#### Terminale 1: Backend Setup
```bash
cd backend
npm install
npm run dev  # Avvia il server tramite nodemon (auto-reload attivo)
```
#### Terminale 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Avvia l'ambiente di sviluppo locale di Vite
'''
