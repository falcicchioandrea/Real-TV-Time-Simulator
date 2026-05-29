import express from "express"; // Importa il modulo Express: posso farlo solo se ho "type": "module" in package.json
import { connectToDB } from "./config/db.js"; // Importa la funzione per connettersi al database
import dotenv from "dotenv"; // Importa il modulo dotenv per gestire le variabili d'ambiente (utile per MONGO_URI)
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";

dotenv.config(); // Carica le variabili d'ambiente dal file .env

const app = express(); // Crea un'app Express

// Middleware che permette di parsare i dati che l'utente invia in formato JSON

app.use(express.json());

const PORT = process.env.PORT || 5000; // Definisce la porta su cui il server ascolterà

app.get("/", (req, res) => {
    res.send("Registrati sulla mia applicazione!"); // Risponde con un messaggio quando viene effettuata una richiesta GET alla radice (root)
})

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
            return res
            .status(400)
            .json({ message: "Esiste già un Utente con questo Username, provane un altro."})
        }

        const emailExists = await User.findOne({ email })

        if(emailExists){
            return res
            .status(400)
            .json({ message: "Esiste già un Utente con questa email."})
        }

        // HASH&SALT della Password
        // Questo meccanismo è un meccanismo di hash&salt che prende in input la password in chiaro dell'utente
        // e il numero di "salt" (in questo caso 10) che indica quante volte viene applicato l'algoritmo di hashing alla password.
        // Più alto è il numero di salt, più sicura sarà la password hashata, ma richiederà anche  più tempo per essere calcolata.
        // 10 o 8 è un numero comune per bilanciare sicurezza e prestazioni. 

        const hashedPassword = await bcryptjs.hash(password, 10);

        // Memorizzazione dati dell'Utente: ATTENZIONE che memorizziamo non la password in chiaro ma quella hashata
        // Creo uno User Document (come se fosse una carta di identità dell'utente) nel nostro database con le informazioni dell'utente registrato
        
        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        return res
        .status(200)
        .json({user: "Registrazione andata a buon fine!"});
        
    } catch(error){

    }

});


app.listen(PORT, () => {
    connectToDB(); // Connette al database quando il server inizia ad ascoltare
    console.log(`Il server è in ascolto sulla porta: ${PORT}`); // Avvia il server e stampa un messaggio di conferma
})








