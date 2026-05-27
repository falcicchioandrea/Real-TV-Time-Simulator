import express from "express"; // Importa il modulo Express: posso farlo solo se ho "type": "module" in package.json

const app = express(); // Crea un'app Express
const port = 3000; // Definisce la porta su cui il server ascolterà

app.get("/", (req, res) => {
    res.send("Registrati sulla mia applicazione!"); // Risponde con un messaggio quando viene effettuata una richiesta GET alla radice (root)
})

app.listen(port, () => {
    console.log(`Il server è in ascolto sulla porta: ${port}`); // Avvia il server e stampa un messaggio di conferma
})




