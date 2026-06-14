import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Aggiunge o rimuove un film dai preferiti dell'utente identificato dal cookie JWT
export const favoriteToggle = async (req,res)=>{

    const {token} = req.cookies;
    const {movieId} = req.body;

    if(!token) return res.status(401).json({message: "Nessun token fornito"});

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        const userDoc = await User.findById(decoded.id);

        if(!userDoc) return res.status(404).json({ message: "Utente non trovato." });

        // Converte l'id a numero per confronti coerenti con l'array salvato
        const numericMovieId = Number(movieId);

        // Se il film è già nei preferiti lo rimuove, altrimenti lo aggiunge
        const isFavorite = userDoc.favoriteMovies.includes(numericMovieId);

        if (isFavorite){
            userDoc.favoriteMovies.pull(numericMovieId)
        }else{
            userDoc.favoriteMovies.push(numericMovieId);
        }

        await userDoc.save();
        return res.status(200).json({
            message: "Preferiti aggiornati",
            favoriteMovies: userDoc.favoriteMovies
        });

    } catch (error) {
        console.log("Errore aggiornamento preferiti: ", error.message);

        // Token mancante, scaduto o non valido
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token non valido o scaduto" });
        }

        // Qualsiasi altro errore interno (es. database)
        return res.status(500).json({ message: "Errore interno del server. Riprova più tardi." });
    }
};
