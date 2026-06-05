import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const registrati = async (req, res) => {
    const { username, email, password } = req.body;

    try { 
        
        // 1. Invio dati richiesti
        if(!username || !email || !password){ 
            return res.status(400).json({ message: "Tutti i campi sono richiesti!" });
        }

        // 2. Credenziali non disponibili

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

        // 3. HASH&SALT della Password

        const hashedPassword = await bcryptjs.hash(password, 10);
        
        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        // 4. JWT (Jason Web Token)

        if(userDoc){

            // jwt.sign( payload, secret, options )
            const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { 
                expiresIn: "7d",
            });

            // Invio il token attraverso un cookie
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            })
        }

        return res
        .status(201)
        .json({user: userDoc, message: "L'Utente è stato creato con successo!"});
        
    } catch(error){
        res.status(400).json({message: error.message});

    }

};

export const accedi = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.findOne({ username });

        if(!userDoc){
            return res.status(400).json({message: "Credenziali non valide."})
        }

        const isPasswordValid = await bcryptjs.compare( 
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

            // Invio il token attraverso un cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            })
        }

        return res
        .status(200)
        .json({user: userDoc, message: "Accesso effettuato correttamente!"});

    } catch(error) {
        console.log("Errore durante l'accesso: ", error.message) // Per testare con PostMan
        res.status(400).json({ message: error.message })

    }
};

export const fetchUser = async (req, res) => {

    const { token } = req.cookies;

    if(!token){
        return res
        .status(401)
        .json({ message: "Nessun token fornito."})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res
            .status(401)
            .json( { message: "Token non valido."})
        }

    const userDoc = await User.findById(decoded.id).select("-password"); 
    
    if(!userDoc){
        return res
        .status(404)
        .json({ message: "No user found."});
    }

    res.status(200).json({ user: userDoc })

    } catch(error) {
        console.log("Errore durante il fetching dell'utente: ", error.message);

        return res
        .status(401)
        .json({ message: error.message})
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout avvenuto correttamente."})
};

