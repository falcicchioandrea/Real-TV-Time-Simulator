import dotenv from "dotenv"; // Importa il modulo dotenv per gestire le variabili d'ambiente (utile per MONGO_URI)
import express from "express"; // Importa il modulo Express: posso farlo solo se ho "type": "module" in package.json
import { connectToDB } from "./config/db.js"; // Importa la funzione per connettersi al database
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"; // Importa il modulo http per creare un server HTTP 
import { Server } from "socket.io"; // Importa il modulo socket.io per la comunicazione in tempo reale 

dotenv.config(); // Carica le variabili d'ambiente dal file .env (DEVONO ESSERE CARICATE PRIMA)

import userRouter from "./routers/routerUser.js" // ALTRO MODO-->const userRouter = require('./routes/routerUser.js') con "type": "commonjs"
import favoriteRouter from "./routers/routerFavorite.js"

const app = express(); // Crea un'app Express
const PORT = process.env.PORT || 5000; // Definisce la porta su cui il server ascolterà

// Middlewares
app.use(cors({
// ==============================================================================
// IL NOSTRO PROBLEMA (La trappola della Same-Origin Policy):
// ==============================================================================
// Abbiamo 3 attori in gioco:
// 1. Il browser (Chrome, Safari, che usa una porta temporanea, es. 54122, per fare materialmente la chiamata).
// 2. Il frontend React (la cui origine di nascita è http://localhost:5173, ma viene integrato nel browser una volta fatta la prima richiesta al server Vite).
// 3. Il server Express (il backend in ascolto su http://localhost:5000).
//
// POSSIAMO fare la richiesta: la chiamata parte dal browser(Chrome, Safari) e arriva al server Express(porta 5000).
// Il server Express esegue il suo codice regolarmente e rimanda indietro i dati.
// IL PROBLEMA: Quando la risposta torna indietro, il browser si accorge che le porte 
// (5173 del frontend e 5000 del backend) sono diverse. Per sicurezza, il browser applica 
// la "Same-Origin Policy": intercetta la risposta e si RIFIUTA di consegnare i dati a React.

// ==============================================================================
// LA SOLUZIONE (CORS come passaporto):
// ==============================================================================
// 1. Il server Express applica il middleware CORS. Questo fa sì che il server 
// inserisca automaticamente un "timbro" nella sua risposta, ovvero l'header: 
// "Access-Control-Allow-Origin: http://localhost:5173".
// 
// 2. Il browser (che agisce da dogana di sicurezza), prima di bloccare tutto, 
// legge questo header. Vedendolo, capisce che il server Express ha esplicitamente 
// autorizzato l'origine 5173. 
//
// 3. Il browser abbassa le difese e permette all'interfaccia utente (React) 
// di ricevere, leggere e visualizzare i dati elaborati dal server. 
    origin: "http://localhost:5173", 

    // 2. Il server inserisce l'header "Access-Control-Allow-Credentials".
    // Permette lo scambio bidirezionale dei cookie di sessione (sia in lettura -->server può leggere cookie del browser  che in scrittura--> server può allegare cookie e inviarlo al browser) 
    // tra domini/porte differenti.
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

//TEST
app.get('/', (req, res) => {
    res.send("Registrati sulla mia applicazione!"); // Risponde con un messaggio quando viene effettuata una richiesta GET alla radice (root)
});

app.use('/user-api', userRouter);
app.use('/favorite-api', favoriteRouter);


app.listen(PORT, () => {
    connectToDB(); // Connette al database quando il server inizia ad ascoltare
    console.log(`Il server è in ascolto sulla porta: ${PORT}`); // Avvia il server e stampa un messaggio di conferma
})








