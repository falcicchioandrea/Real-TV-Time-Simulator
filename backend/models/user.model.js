import mongoose from "mongoose";

// 1. DEFINIZIONE DELLO SCHEMA
// Lo schema è la "carta d'identità" o il blueprint dei tuoi dati. 
// Stabilisce quali campi può avere un documento Utente nel database e le loro regole.

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

// 2. CREAZIONE/CONNESSIONE DEL MODELLO (La riga che hai evidenziato)
// Il "Modello" è la classe reale che usi nel codice per fare operazioni come User.create() o User.find().

const User = mongoose.model.User || mongoose.model("User", userSchema);

// Perché scriviamo così? Il primo controlla se l'User esiste; il secondo crea un modello 
// se non esiste. 

// Parte A: mongoose.models.User (Il controllo)
// Dice a Mongoose: "Controlla se nella tua memoria interna esiste già un modello chiamato 'User'".
// Se esiste, usa quello esistente e assegnalo alla costante User.

// Parte B: mongoose.model("User", userSchema) (La creazione)
// Se la Parte A fallisce (cioè restituisce undefined perché è la primissima volta che il codice viene eseguito), 
// allora interviene il piano B: Mongoose crea da zero il modello "User" basandosi sulle regole scritte in userSchema.

export default User;

