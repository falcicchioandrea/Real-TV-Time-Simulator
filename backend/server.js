import express from "express"; // Importa il modulo Express: posso farlo solo se ho "type": "module" in package.json
import { connectToDB } from "./config/db.js"; // Importa la funzione per connettersi al database
import dotenv from "dotenv"; // Importa il modulo dotenv per gestire le variabili d'ambiente (utile per MONGO_URI)

dotenv.config(); // Carica le variabili d'ambiente dal file .env

const app = express(); // Crea un'app Express

// Middleware che permette di parsare i dati che l'utente invia in formato JSON

app.use(express.json());

const PORT = process.env.PORT || 5000; // Definisce la porta su cui il server ascolterà

app.get("/", (req, res) => {
    res.send("Registrati sulla mia applicazione!"); // Risponde con un messaggio quando viene effettuata una richiesta GET alla radice (root)
})

// Inserisco una API per costruire una rotta (endpoint) '/api/registrati' verso cui l'utente farà una post
// inviando i dati che il server si aspetta (username, password e email)

app.post("/api/registrati", async (req, res) => {
    const { username, email, password } = req.body;

    // OSS: il campo 'Conferma Password' serve solo per validare la registrazione e non va inserito nello User.Schema e nella POST 

    console.log( username, email, password); // Serve per verificare con PostMan che i dati vengano inviati correttamente
    
    return res.status(200).json({user: "Done"}); // Restituisce OK se la registrazione va a buon fine
});


app.listen(PORT, () => {
    connectToDB(); // Connette al database quando il server inizia ad ascoltare
    console.log(`Il server è in ascolto sulla porta: ${PORT}`); // Avvia il server e stampa un messaggio di conferma
})








