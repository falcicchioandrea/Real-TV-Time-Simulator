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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const signup = async (username, email, password) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post("/api/registrati", {
        username,
        email,
        password,
      });
      setUser(response.data.user); // Se la registrazione ha successo, settiamo l'utente con i dati ricevuti dal backend
      setMessage(response.data.message); // Impostiamo il messaggio di successo ricevuto dal backend
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Si è verificato un errore durante la registrazione.",
      ); // Impostiamo il messaggio di errore ricevuto dal backend o un messaggio generico se non disponibile
      throw err; // Rilanciamo l'errore per gestirlo anche nei componenti che chiamano questa funzione
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post("/api/accedi", { username, password });
      setUser(response.data.user); // Se il login ha successo, settiamo l'utente con i dati ricevuti dal backend
      setMessage(response.data.message); // Impostiamo il messaggio di successo ricevuto dal backend
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Si è verificato un errore durante il login.",
      );
      throw err;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post("/api/esci");
      const message =
        response.data.message || "Logout effettuato con successo.";
      setMessage(message);
      setIsLoading(false);
      setUser(null); // Rimuoviamo l'utente dallo stato, indicando che non c'è più una sessione attiva
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Si è verificato un errore durante il logout.",
      );
      throw err;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    // eslint-disable-next-line
    fetchUser();
  }, []); // eseguito una volta all'avvio dell'applicazione

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchingUser,
        isLoading,
        error,
        message,
        signup,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line
export function useAuth() {
  return useContext(AuthContext);
}
