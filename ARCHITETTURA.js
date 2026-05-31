/**
 * =========================================================================================
 * 🧠 ARCHITETTURA DI BASE: COME COMUNICA IL WEB (Il Flusso Completo)
 * =========================================================================================
 * Immagina l'applicazione come un Ristorante:
 * 1. Frontend (React/Browser): Il Cliente seduto al tavolo + Il Menu.
 * 2. API (Richiesta HTTP): Il Cameriere che prende l'ordinazione e la porta in cucina.
 * 3. Backend (Express/Node.js): Il Cuoco che riceve il bigliettino e prepara il piatto.
 * 4. Database (MongoDB): La Dispensa dove il cuoco prende gli ingredienti.
 * =========================================================================================
 */

// -----------------------------------------------------------------------------------------
// FASE 1: L'INNESCO NEL FRONTEND (React)
// -----------------------------------------------------------------------------------------
// Tutto inizia sempre da un'azione dell'utente (o da un useEffect al caricamento della pagina).
// L'utente clicca su "Aggiungi ai Preferiti". React cattura questo evento (onClick).
// In questo momento, siamo esclusivamente sulla porta del frontend (es. 5173).
const handleToggleFavorite = async () => {
    
    // React prepara il "bigliettino per il cameriere" (Il payload / i dati da inviare).
    const datiDaInviare = { movieId: 550 }; 

    try {
        // ---------------------------------------------------------------------------------
        // FASE 2: IL VIAGGIO E LA CHIAMATA API (Il Cameriere parte)
        // ---------------------------------------------------------------------------------
        // React usa axios (o fetch) per "chiamare" l'API. 
        // Questo è il momento in cui abbandoniamo la porta 5173 e viaggiamo nella rete
        // verso la porta del server (5000).
        // 
        // Il browser (che fa da poliziotto/dogana) apre una porta temporanea e spara la richiesta.
        // Se c'è 'withCredentials: true', il browser attacca al bigliettino anche il Cookie 
        // per dire al backend: "Ehi, questo è Giuseppe".
        const risposta = await axios.post("http://localhost:5000/api/favorites", datiDaInviare);


/** ===================== [ FUORI DAL BROWSER: SIAMO SUL SERVER ] ========================== */

        // ---------------------------------------------------------------------------------
        // FASE 3: IL MOTORE BACKEND E IL DATABASE (Express & MongoDB)
        // ---------------------------------------------------------------------------------
        /*
            A. IL RICEVIMENTO (Router/Endpoint)
            Express sulla porta 5000 è in ascolto. Vede arrivare la richiesta a "/api/favorites".
            Legge il Cookie, capisce chi è l'utente, e legge il body (movieId: 550).
            
            B. IL LAVORO (Controller)
            Express contatta il Database (MongoDB): 
            "Trova l'utente Giuseppe e aggiungi il film 550 al suo array".

            C. LA FIRMA DEL PASSAPORTO (Il CORS)
            Il Cuoco ha finito di preparare il piatto (i dati aggiornati). 
            Prima di dare il piatto al Cameriere per riportarlo al tavolo, Express applica il CORS:
            "Scrivi sul pacchetto che autorizzo la porta 5173 e i suoi cookie a leggere questo piatto!".

            D. LA SPEDIZIONE (Response)
            Express invia indietro il risultato: `res.status(200).json({ favoritiAggiornati: [...] })`
        */

/** ===================== [ RITORNO NEL BROWSER: SIAMO SUL FRONTEND ] ====================== */

        // ---------------------------------------------------------------------------------
        // FASE 4: LA DOGANA DEL BROWSER E L'AGGIORNAMENTO DELLA UI
        // ---------------------------------------------------------------------------------
        // Il Cameriere torna al tavolo (la 'risposta' qui sopra si riempie di dati).
        // Prima che React possa toccare la risposta, il Browser controlla il piatto:
        // "Vediamo... l'ha mandato la porta 5000. C'è il timbro CORS per la 5173? Sì!".
        // Il Browser sblocca i dati.

        // React finalmente legge il JSON inviato dal Backend.
        const nuoviPreferiti = risposta.data.favoritiAggiornati;

        // L'ultimo passo: React aggiorna il suo "Stato" (Context o State locale).
        // Appena setUser() viene chiamato, React capisce che i dati sono cambiati
        // e ricolora magicamente il cuore di rosso in frazioni di secondo, 
        // senza dover ricaricare l'intera pagina del browser.
        setUser({ ...user, favorites: nuoviPreferiti });

    } catch (errore) {
        // Se il Server risponde con un errore (es. 401 Non Autorizzato) 
        // o se il Browser blocca la richiesta (Errore CORS per mancanza del timbro),
        // finiamo qui dentro e mostriamo un alert all'utente.
        console.error("Houston, abbiamo un problema:", errore);
    }
};