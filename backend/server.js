import express from "express"; // Importa il modulo Express: posso farlo solo se ho "type": "module" in package.json
import { connectToDB } from "./config/db.js"; // Importa la funzione per connettersi al database
import dotenv from "dotenv"; // Importa il modulo dotenv per gestire le variabili d'ambiente (utile per MONGO_URI)
import User from "./models/user.model.js";

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

    try { 
        // L'utente DEVE inserire tutti i dati richiesti

        if(!username || !email || !password){ 
            throw new Error("Tutti i campi sono richiesti!")
        }

        // Voglio controllare che non si possa fare una registrazione se esistono già username e email
        // uguali nel mio Database:

        const usernameExists = await User.findOne({ username })

        if(usernameExists){
            return res.status(400).json({ message: "Esiste già un Utente con questo Username, provane un altro."})
        }

        const emailExists = await User.findOne({ email })

        if(emailExists){
            return res.status(400).json({ message: "Esiste già un Utente con questa email."})
        }

       

        return res.status(200).json({user: "Registrazione andata a buon fine!"});
        
    } catch(error){

    }

});


app.listen(PORT, () => {
    connectToDB(); // Connette al database quando il server inizia ad ascoltare
    console.log(`Il server è in ascolto sulla porta: ${PORT}`); // Avvia il server e stampa un messaggio di conferma
})








