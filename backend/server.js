import express from "express"; // Importa il modulo Express: posso farlo solo se ho "type": "module" in package.json
import { connectToDB } from "./config/db.js"; // Importa la funzione per connettersi al database
import dotenv from "dotenv"; // Importa il modulo dotenv per gestire le variabili d'ambiente (utile per MONGO_URI)
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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

        const hashedPassword = await bcryptjs.hash(password, 10);
        
        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        // JWT (Jason Web Token): serve per gestire la sessione dell'Utente 
        // con un'alternativa 'stateless'

        // Se l'utente esiste nel database, allora gli assegno un token 
        if(userDoc){
            // jwt.sign( payload, secret, options )
            // 1. Inserisco nel payload l'ID dell'Utente: il payload non è segreto, ecco perché
            // inseriamo solo l'ID dell'Utente e mai dati sensibili come password

            // 2. Inserisco nel secret la chiave che serve a firmare il token che è salvata nel proprio
            // file .env nascosto. Il segreto garantisce l'autenticità del token

            // 3. Nel campo options stabilisco la scadenza del token: dopo 7 giorni l'utente dovrà rieffettuare
            // il login
            const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { 
                expiresIn: "7d",
            });

            // Adesso inviamo il token all'utente attraverso un cookie (per maggiore sicurezza)
            // 1. "httpOnly: true": impedisce categoricamente a qualsiasi codice JavaScript (anche al tuo stesso codice React) di leggere o modificare questo cookie.
            // OSS: Se un hacker riuscisse a iniettare del codice JavaScript maligno nel tuo sito (un attacco chiamato XSS - Cross-Site Scripting), 
            // non potrebbe comunque rubare il token, perché per JavaScript quel cookie semplicemente
            // non esiste. Il cookie verrà scambiato esclusivamente tra il browser e il server 
            // in modo automatico a ogni richiesta HTTP, invisibile a occhi indiscreti

            // 2. "secure: process.env.NODE_ENV === "production"": Questa riga serve a far viaggiare il cookie solo se la connessione è protetta.
            // OSS: Se è impostato su true, il cookie verrà inviato solo attraverso connessioni criptate HTTPS.
            // Perchè è scritto così? process.env.NODE_ENV === "production" è un controllo intelligente
            // Quando stai programmando sul tuo PC in locale (localhost), la connessione è in HTTP (non sicuro). Il controllo risulterà false, permettendoti di testare il sito senza blocchi.
            // Quando caricherai il sito online (in produzione), il controllo diventerà true e il cookie pretenderà l'HTTPS, impedendo che il token venga intercettato su reti Wi-Fi pubbliche o non protette.
            
            // 3. "sameSite: "strict"": Questa opzione serve a proteggere l'utente da un attacco chiamato CSRF (Cross-Site Request Forgery), ovvero quando un sito maligno prova a fare azioni a nome dell'utente.
            // Impostandolo su "strict" (rigido), dici al browser: "Invia questo cookie al mio server SOLO SE l'utente sta navigando direttamente sul mio sito".
            // Se l'utente è loggato sul tuo sito (il-tuo-sito.com) e clicca su un link strano mentre si trova su un altro sito (es. sito-truffa.com), il browser rifiuterà di inviare il cookie di autenticazione verso il tuo server. 
            // In questo modo il sito truffa non potrà fare operazioni dannose sfruttando la sessione attiva dell'utente.
            
            res.cookie("token", token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
        }

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








