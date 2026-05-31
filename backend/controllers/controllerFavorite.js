import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const favoriteToggle = async (req,res)=>{
    const {token} = req.cookies;
    const {movieId} = req.body;

    if(!token) return res.status(401).json({message: "Nessun token fornito"});

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET); //caso di fallimento da un errore
        const userDoc = await User.findById(decoded.id);  // caso di fallimento da null

        if(!userDoc) return res.status(404).json({ message: "Utente non trovato." });

        // Verifica se l'ID del film è già nei preferiti
        const isFavorite = userDoc.favoriteMovies.includes(movieId);

        // Converte esplicitamente movieId in un numero per evitare conflitti di tipo "550" !== 550
        const numericMovieId = Number(movieId);

        if (isFavorite){
            userDoc.favoriteMovies.pull(movieId)
        }else{
            userDoc.favoriteMovies.push(movieId);
        }

        await userDoc.save();  // await--> blocchi momentaneamente l'esecuzione aspettando che MongoDb salvi UserDoc nel database (.save())
        return res.status(200).json({ 
            message: "Preferiti aggiornati", 
            favoriteMovies: userDoc.favoriteMovies 
        });

    } catch (error) {
        console.log("Errore aggiornamento preferiti: ", error.message);
        return res.status(401).json({ message: "Token non valido o scaduto" });
    }
};