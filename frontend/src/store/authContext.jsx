// Contesto globale di autenticazione: espone utente, login/logout, registrazione,
// gestione delle modali e toggle dei preferiti a tutta l'app tramite useAuth().

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Configurazione globale di axios: URL base del backend e invio dei cookie di sessione
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true; // Necessario per inviare/ricevere il cookie di sessione

const AuthContext = createContext(null);

// Provider che avvolge l'intera app (in main.jsx) e condivide lo stato di autenticazione
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Dati dell'utente loggato, o null
  const [fetchingUser, setFetchingUser] = useState(true); // true mentre si verifica la sessione all'avvio

  // Stato per il feedback dell'interfaccia
  const [isLoading, setIsLoading] = useState(false); // true durante una richiesta HTTP
  const [error, setError] = useState(null); // Messaggio di errore corrente
  const [message, setMessage] = useState(null); // Messaggio di successo corrente

  const [isLoginOpen, setIsLoginOpen] = useState(false); // Visibilità della modale di login
  const [isSignupOpen, setIsSignupOpen] = useState(false); // Visibilità della modale di registrazione

  // Verifica all'avvio se esiste una sessione valida (cookie) e carica l'utente
  const fetchUser = async () => {
    setFetchingUser(true);
    try {
      const response = await axios.get("/user-api/fetch-user");
      setUser(response.data.user);
    } catch {
      setUser(null); // Nessuna sessione attiva
    } finally {
      setFetchingUser(false);
    }
  };

  // Registra un nuovo utente e lo logga automaticamente in caso di successo
  const signup = async (username, email, password) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post("/user-api/registrati", {
        username,
        email,
        password,
      });

      setUser(response.data.user);
      setIsSignupOpen(false);
      setMessage(response.data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Si è verificato un errore durante la registrazione.",
      );
      throw err; // Rilancia l'errore al form chiamante
    }
  };

  // Autentica un utente esistente e ne salva i dati nello stato globale
  const login = async (username, password) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post("/user-api/accedi", {
        username,
        password,
      });

      setUser(response.data.user);
      setIsLoginOpen(false);
      setMessage(response.data.message);
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

  // Termina la sessione corrente e svuota lo stato utente
  const logout = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post("/user-api/esci");

      const message =
        response.data.message || "Logout effettuato con successo.";
      setMessage(message);
      setIsLoading(false);

      setUser(null);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Si è verificato un errore durante il logout.",
      );
      throw err;
    }
  };

  // Azzera il messaggio di errore corrente
  const clearError = () => setError(null);

  // Apertura/chiusura e passaggio tra le modali di login e registrazione
  const openLogin = () => {
    setError(null);
    setMessage(null);
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setError(null);
    setMessage(null);
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const closeAuth = () => {
    setError(null);
    setMessage(null);
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  // Aggiunge o rimuove un film dai preferiti; se l'utente non è loggato apre il login
  const toggleFavorite = async (movieId) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/favorite-api/favouriteToggle", {
        movieId,
      });

      setUser({
        username: user.username,
        email: user.email,
        password: user.password,
        favoriteMovies: response.data.favoriteMovies,
      });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Impossibile aggiornare i preferiti in questo momento.",
      );
      throw err;
    }
  };

  // All'avvio dell'app verifica una sola volta se esiste già una sessione attiva
  useEffect(() => {
    // eslint-disable-next-line
    fetchUser();
  }, []);

  // Rende disponibili stato e funzioni a tutti i componenti figli tramite useAuth()
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
        isLoginOpen,
        isSignupOpen,
        openLogin,
        openSignup,
        closeAuth,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Per leggere il contesto di autenticazione da qualsiasi componente
// eslint-disable-next-line
export function useAuth() {
  return useContext(AuthContext);
}
