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

        if(userDoc){
            // jwt.sign( payload, secret, options )

            const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { 
                expiresIn: "7d",
            });

            // Adesso inviamo il token all'utente attraverso un cookie (per maggiore sicurezza)
            
            res.cookie("token", token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
        }

        // Se tutti va a buon fine allora vedo su PostMan che tutto è andato correttamente
        return res
        .status(200)
        .json({user: userDoc, message: "L'Utente è stato creato con successo!"});
        
    } catch(error){
        res.status(400).json({message: error.message});

    }

});

// Creo la POST per l'accesso:
// il server riceve username e password; 
app.post("/api/accedi", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.findOne({ username });
    // Se non esiste uno user Document con le stesse credenziali (username)
    // allora invio un errore

        if(!userDoc){
            return res.status(400).json({message: "Credenziali non valide."})
        }

        // Controllo se la password è valida facendo un confronto tra la password inserita dall'utente
        // e quella dello userDoc: la funzione compareSync() della libreria bcryptjs permette di
        // effettuare un confronto tra la password e l'hash in modo tale da trovare una corrispondenza

        const isPasswordValid = await bcryptjs.compareSync(
            password, 
            userDoc.password
        );

        if(!isPasswordValid){
            return res.status(400).json({ message: "Credenziali non valide."})
        }


        // JWT (identica alla POST di registrazione)

        if(userDoc){
            // jwt.sign( payload, secret, options )

            const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { 
                expiresIn: "7d",
            });

            // Adesso inviamo il token all'utente attraverso un cookie (per maggiore sicurezza)
            
            res.cookie("token", token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
        }

        // Se tutti va a buon fine allora vedo su PostMan che tutto è andato correttamente
        return res
        .status(200)
        .json({user: userDoc, message: "Accesso effettuato correttamente!"});

    } catch(error) {
        console.log("Errore durante l'accesso: ", error.message) // Per testare con PostMan
        res.status(400).json({ message: error.message })

    }
})

// Questa nuova rotta 'fetch-user' serve a React per chiedere al server: "C'è un utente loggato in questo momento?"

app.get("/api/fetch-user", async (req, res) => {

    // 1. Il Recupero del Cookie: const { token } = req.cookies;
    // Il client (React) fa una richiesta GET a /api/fetch-user. Il browser, in automatico allega il cookie alla richiesta. 
    // Con questa riga, Express estrae il token direttamente dal "vassoio" dei cookie ricevuti.
    const { token } = req.cookies;

    // Avremo bisogno del middleware cookie-parser

    // 2. Se la variabile token è vuota, significa che l'utente non ha mai fatto il login, oppure il cookie è scaduto, o l'utente lo ha cancellato.
    // Il server interrompe subito l'esecuzione e restituisce un codice 401 Unauthorized (Non autorizzato).
    if(!token){
        return res.status(401).json({ message: "Nessun token fornito."})
    }

    // 3. Se il token esiste, entra in gioco il blocco try:
    // Il server prende il token e lo "decifra" usando la stessa chiave segreta (JWT_SECRET) con cui lo aveva creato.
    // Se il token è autentico, dentro la variabile decoded ci sarà esattamente l'oggetto inserito nel payload durante il login (ovvero l'ID dell'utente: { id: "..." }).
    // Se il token è contraffatto o scaduto: Il metodo jwt.verify lancerà un errore (un'eccezione) e il codice salterà immediatamente dentro il blocco catch
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json( { message: "Token non valido."})
        }

    // 4. Il Recupero dal Database: User.findById(decoded.id).select("-password"):
    // User.findById(decoded.id): dice a Mongoose di cercare nella collezione degli utenti (User)
    // quel documento specifico che ha esattamente l'_id uguale a quello decodificato dal token.
    // Inoltre, evito di mostrare la password grazie alla funzione .select("-password") perché non ha senso far
    // viaggiare informazioni sensibili come la password. Serve solamente sapere chi è loggato attualmente

    const userDoc = await User.findById(decoded.id).select("-password"); 
    
    // 5. Il Controllo di Esistenza: if(!userDoc) { ... }
    // Anche se il token è valido, potrebbe succedere un caso limite: l'utente esisteva quando ha fatto il login,
    // ma nel frattempo un amministratore lo ha cancellato dal database.
    // Se User.findById non trova nulla, restituisce null. Questo if intercetta il problema, blocca la richiesta e 
    // risponde con un errore (Error 404: Not Found!).
    if(!userDoc){
        return res.status(404).json({ message: "No user found."});
    }

    // 6. La Risposta di Successo: res.status(200).json({ user: userDoc })
    // Se l'utente viene trovato, tutto è andato per il verso giusto!
    // Il server risponde con lo stato 200 OK e invia a React un oggetto 
    // JSON contenente tutti i dati dell'utente (senza password)

    // Ora React riceverà questo oggetto, lo salverà nel suo stato globale 
    // (magari usando un Context o Redux) e potrà finalmente mostrare a schermo 
    // il nome dell'utente, la sua foto profilo e i suoi film salvati
    res.status(200).json({ user: userDoc })

    // Il blocco catch è fondamentale perché "cattura" qualsiasi imprevisto 
    // che possa far crashare il server durante le operazioni precedenti.

    } catch(error) {
        console.log("Errore durante il fetching dell'utente: ", error.message);
        return res.status(400).json({ message: error.message})
    }
})


app.listen(PORT, () => {
    connectToDB(); // Connette al database quando il server inizia ad ascoltare
    console.log(`Il server è in ascolto sulla porta: ${PORT}`); // Avvia il server e stampa un messaggio di conferma
})








