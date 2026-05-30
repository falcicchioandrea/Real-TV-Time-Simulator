import express from "express"; // Importa il modulo Express: posso farlo solo se ho "type": "module" in package.json
import { connectToDB } from "./config/db.js"; // Importa la funzione per connettersi al database
import dotenv from "dotenv"; // Importa il modulo dotenv per gestire le variabili d'ambiente (utile per MONGO_URI)
import cookieParser from "cookie-parser";
import userRouter from "./routes/routerUser.js" // ALTRO MODO-->const userRouter = require('./routes/routerUser.js')

dotenv.config(); // Carica le variabili d'ambiente dal file .env
const app = express(); // Crea un'app Express
const PORT = process.env.PORT || 5000; // Definisce la porta su cui il server ascolterà

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use('/user-api', userRouter);

app.listen(PORT, () => {
    connectToDB(); // Connette al database quando il server inizia ad ascoltare
    console.log(`Il server è in ascolto sulla porta: ${PORT}`); // Avvia il server e stampa un messaggio di conferma
})








