import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Tutte le chiamate di Axios useranno questo URL come base
axios.defaults.baseURL = "http://localhost:5000";
// Dice al broswer di includere i cookie nelle richieste. Necessario per il fetch-user
axios.defaults.withCredentials = true;

// Creazione contesto con valore iniziale nullo

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Nessun utente loggato
  const [fetchingUser, setFetchingUser] = useState(true); // All'avvio non sappiamo ancora se c'è una sessione attiva.

  const fetchUser = async () => {
    setFetchingUser(true);
    try {
      const response = await axios.get("/api/fetch-user");
      setUser(response.data.user); // Se c'è una sessione attiva, settiamo l'utente con i dati ricevuti dal backend
    } catch {
      setUser(null);
    } finally {
      setFetchingUser(false); // Abbiamo finito di verificare la sessione, indipendentemente dal risultato
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // eseguito una volta all'avvio dell'applicazione

  return (
    <AuthContext.Provider value={{ user, setUser, fetchingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
