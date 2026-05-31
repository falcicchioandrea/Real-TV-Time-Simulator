import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const favoriteToggle = async (req,res)=>{
    const {token} = req.cookies;
    const {movieId} = req.body;

    if(!token) return res.status(401).json({message: "Nessun token fornito"}); //401 Unauthorized

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET); //caso di fallimento da un errore catturato da catch 401
        const userDoc = await User.findById(decoded.id);  // caso di fallimento da null

        if(!userDoc) return res.status(404).json({ message: "Utente non trovato." });  //404 Not Found

        // Converte esplicitamente movieId in un numero per evitare conflitti di tipo "550" !== 550
        const numericMovieId = Number(movieId);

        // Verifica se l'ID del film è già nei preferiti
        const isFavorite = userDoc.favoriteMovies.includes(numericMovieId);

        if (isFavorite){
            userDoc.favoriteMovies.pull(numericMovieId)
        }else{
            userDoc.favoriteMovies.push(numericMovieId);
        }

        await userDoc.save();  // await--> blocchi momentaneamente l'esecuzione aspettando che MongoDb salvi UserDoc nel database (.save())
        return res.status(200).json({ 
            message: "Preferiti aggiornati", 
            favoriteMovies: userDoc.favoriteMovies 
        });

    } catch (error) {
        console.log("Errore aggiornamento preferiti: ", error.message);

        // Se l'errore è dovuto al token invalido o scaduto (401 Unauthorized)
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token non valido o scaduto" });
        }

        // Per qualsiasi altro crash interno (es. database), rispondiamo con 500
        return res.status(500).json({ message: "Errore interno del server. Riprova più tardi." });  // Internal Server Error --> 500
    }
};