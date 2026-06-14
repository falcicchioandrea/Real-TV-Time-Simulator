import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Registra un nuovo utente: valida i dati, controlla username/email univoci,
// salva la password cifrata e autentica subito tramite cookie JWT.
export const registrati = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Tutti i campi sono obbligatori
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tutti i campi sono richiesti!" });
    }

    // Username ed email devono essere univoci
    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res.status(400).json({
        message: "Esiste già un Utente con questo Username, provane un altro.",
      });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res
        .status(400)
        .json({ message: "Esiste già un Utente con questa email." });
    }

    // Cifra la password (hash + salt) prima di salvarla
    const hashedPassword = await bcryptjs.hash(password, 10);

    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Genera il token JWT e lo invia in un cookie httpOnly (valido 7 giorni)
    if (userDoc) {
      const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    // Restituisce l'utente senza la password
    const userObj = userDoc.toObject();
    delete userObj.password;

    return res.status(201).json({
      user: userObj,
      message: "L'Utente è stato creato con successo!",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login: verifica username e password e, se corrette, imposta il cookie JWT
export const accedi = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(400).json({ message: "Credenziali non valide." });
    }

    // Confronta la password in chiaro con quella cifrata salvata
    const isPasswordValid = await bcryptjs.compare(password, userDoc.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenziali non valide." });
    }

    // Genera il token JWT e lo invia in un cookie httpOnly (valido 7 giorni)
    if (userDoc) {
      const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    const userObj = userDoc.toObject();
    delete userObj.password;

    return res.status(200).json({
      user: userObj,
      message: "Accesso effettuato correttamente!",
    });
  } catch (error) {
    console.log("Errore durante l'accesso: ", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Restituisce l'utente loggato leggendo il token JWT dal cookie di sessione
export const fetchUser = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Nessun token fornito." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Token non valido." });
    }

    const userDoc = await User.findById(decoded.id).select("-password");

    if (!userDoc) {
      return res.status(404).json({ message: "No user found." });
    }

    res.status(200).json({ user: userDoc });
  } catch (error) {
    console.log("Errore durante il fetching dell'utente: ", error.message);

    return res.status(401).json({ message: error.message });
  }
};

// Logout: cancella il cookie di sessione
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout avvenuto correttamente." });
};
