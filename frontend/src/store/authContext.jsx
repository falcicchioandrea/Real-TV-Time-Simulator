// ============================================================
// AuthContext.jsx
// ============================================================
// Questo file implementa il sistema di autenticazione globale
// dell'applicazione usando il pattern "Context + Provider" di React.
//
// PROBLEMA CHE RISOLVE:
// Senza questo file, per passare l'utente loggato da App.jsx
// fino a un componente annidato (es. Navbar > Menu > UserAvatar)
// bisognerebbe passare la prop "user" manualmente a ogni livello.
// Questo si chiama "prop drilling" ed è difficile da mantenere.
//
// SOLUZIONE:
// Il Context di React crea un "canale" globale: chiunque voglia
// sapere chi è loggato chiama semplicemente useAuth() e riceve
// tutto — senza bisogno di props intermedie.
// ============================================================

import { createContext, useContext, useState, useEffect, use } from "react";
// createContext → crea il canale di comunicazione globale
// useContext    → permette ai componenti di leggere dal canale
// useState      → crea variabili di stato reattive (quando cambiano, React ri-renderizza)
// useEffect     → esegue codice in risposta a eventi del ciclo di vita del componente

import axios from "axios";
// Axios è una libreria per fare richieste HTTP (alternativa a fetch).
// Aggiunge funzionalità utili come la gestione automatica degli errori
// e la possibilità di impostare un baseURL comune per tutte le richieste.

// ------------------------------------------------------------
// CONFIGURAZIONE GLOBALE DI AXIOS
// Queste impostazioni si applicano automaticamente a TUTTE
// le chiamate axios fatte nell'intera applicazione.
// ------------------------------------------------------------

// Prefisso URL comune: invece di scrivere ogni volta
// "http://localhost:5000/api/accedi", basterà "/api/accedi"
axios.defaults.baseURL = "http://localhost:5000";

// Dice al browser di includere i cookie nelle richieste HTTP.
// È obbligatorio per le sessioni: il server manda un cookie di sessione
// dopo il login, e il browser deve rimandarlo a ogni richiesta successiva
// per dimostrare "sono io, sono già autenticato".
axios.defaults.withCredentials = true;

// ------------------------------------------------------------
// CREAZIONE DEL CONTESTO
// ------------------------------------------------------------
// createContext() crea il "canale" React. Il valore null è solo
// il valore di default nel caso in cui qualcuno chiami useAuth()
// fuori da un AuthProvider (situazione di errore, non dovrebbe accadere).
const AuthContext = createContext(null);

// ------------------------------------------------------------
// AUTHPROVIDER — il componente "contenitore"
// ------------------------------------------------------------
// AuthProvider è un normale componente React con un ruolo speciale:
// avvolge TUTTA l'applicazione (viene usato in main.jsx attorno a <App />)
// e rende disponibile lo stato di autenticazione a ogni componente figlio.
//
// USO IN main.jsx:
//   <AuthProvider>
//     <App />       ← children: tutto ciò che è scritto dentro i tag
//   </AuthProvider>
//
// { children } è una prop speciale che React passa automaticamente:
// contiene tutto ciò che viene scritto DENTRO i tag <AuthProvider>...</AuthProvider>.
// AuthProvider non sa (né deve sapere) cosa c'è dentro — lo riceve e lo mostra.
export function AuthProvider({ children }) {
  // ----------------------------------------------------------
  // STATO: utente e sessione
  // ----------------------------------------------------------

  // "user" contiene i dati dell'utente loggato (es. { id, username, email })
  // oppure null se nessuno è loggato.
  // useState(null) → valore iniziale: nessun utente.
  const [user, setUser] = useState(null);

  // "fetchingUser" indica se stiamo ancora verificando la sessione.
  // Parte da true perché all'avvio dell'app non sappiamo ancora
  // se esiste già un cookie di sessione valido.
  // Serve per mostrare uno spinner o bloccare il rendering
  // finché non abbiamo la risposta dal backend.
  const [fetchingUser, setFetchingUser] = useState(true);

  // ----------------------------------------------------------
  // STATO: feedback UI
  // ----------------------------------------------------------

  // true mentre una richiesta HTTP è in corso.
  // Usato per disabilitare bottoni e mostrare indicatori di caricamento.
  const [isLoading, setIsLoading] = useState(false);

  // Contiene il messaggio di errore dell'ultima operazione fallita,
  // oppure null se non ci sono errori attivi.
  const [error, setError] = useState(null);

  // Contiene il messaggio di successo dell'ultima operazione riuscita
  // (es. "Registrazione completata!"), oppure null.
  const [message, setMessage] = useState(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);   // Controlla se la finestra di Login deve essere visibile sullo schermo
  const [isSignupOpen, setIsSignupOpen] = useState(false); // Controlla se la finestra di Registrazione (Signup) deve essere visibile

  // ----------------------------------------------------------
  // FUNZIONE: fetchUser
  // ----------------------------------------------------------
  // Chiede al backend se esiste già una sessione attiva
  // (cioè se il browser ha un cookie di sessione valido).
  // Viene chiamata automaticamente all'avvio dell'app tramite useEffect.
  //
  // Scenari possibili:
  //   - Utente aveva già fatto login → il cookie è valido → setUser(dati)
  //   - Utente non era loggato / cookie scaduto → setUser(null)
  const fetchUser = async () => {
    setFetchingUser(true);
    try {
      // GET /api/fetch-user: il backend legge il cookie di sessione
      // e restituisce i dati dell'utente se la sessione è valida
      const response = await axios.get("/api/fetch-user");
      setUser(response.data.user);
    } catch {
      // La richiesta fallisce → nessuna sessione attiva → utente non loggato
      setUser(null);
    } finally {
      // "finally" viene eseguito SEMPRE, sia in caso di successo che di errore.
      // Segna che la verifica iniziale della sessione è terminata.
      setFetchingUser(false);
    }
  };

  // ----------------------------------------------------------
  // FUNZIONE: signup
  // ----------------------------------------------------------
  // Registra un nuovo utente nel sistema.
  // Parametri: username, email, password (ricevuti dal form di registrazione)
  //
  // In caso di successo: l'utente viene loggato automaticamente (setUser)
  // In caso di errore: salva il messaggio di errore e rilancia l'eccezione
  const signup = async (username, email, password) => {
    setIsLoading(true);
    setMessage(null); // pulisce eventuali messaggi precedenti

    try {
      // POST /api/registrati: invia i dati di registrazione al backend.
      // La sintassi { username, email, password } è shorthand per
      // { username: username, email: email, password: password }
      const response = await axios.post("/api/registrati", {
        username,
        email,
        password,
      });

      // La registrazione è andata a buon fine:
      setUser(response.data.user); // salva i dati utente nello stato globale
      setIsSignupOpen(false);
      setMessage(response.data.message); // salva il messaggio di successo
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      // err.response?.data?.message → usa il "optional chaining" (?.)
      // per accedere in sicurezza a proprietà che potrebbero non esistere.
      // Se err.response è undefined (es. nessuna risposta dal server),
      // non va in crash ma restituisce undefined, e l'operatore ||
      // fornisce il messaggio di fallback.
      setError(
        err.response?.data?.message ||
          "Si è verificato un errore durante la registrazione.",
      );

      // "throw err" rilancia l'errore al componente che ha chiamato signup().
      // Permette al form di registrazione di aggiungere la propria logica
      // (es. non navigare alla pagina successiva se c'è stato un errore).
      throw err;
    }
  };

  // ----------------------------------------------------------
  // FUNZIONE: login
  // ----------------------------------------------------------
  // Autentica un utente esistente.
  // Parametri: username, password (ricevuti dal form di login)
  //
  // In caso di successo: salva l'utente nello stato globale
  // In caso di errore: salva il messaggio di errore e rilancia l'eccezione
  const login = async (username, password) => {
    setIsLoading(true);
    setMessage(null);
    setError(null); // pulisce eventuali errori precedenti
    try {
      // POST /api/accedi: invia username e password al backend
      const response = await axios.post("/api/accedi", { username, password });

      setUser(response.data.user); // salva i dati utente nello stato globale
      setIsLoginOpen(false)
      setMessage(response.data.message); // salva il messaggio di successo
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Si è verificato un errore durante il login.",
      );
      throw err; // rilancia l'errore al componente chiamante (es. LoginPage)
    }
  };

  // ----------------------------------------------------------
  // FUNZIONE: logout
  // ----------------------------------------------------------
  // Termina la sessione dell'utente corrente.
  // Non riceve parametri: lavora sull'utente attualmente loggato
  // (identificato dal cookie di sessione inviato automaticamente da axios).
  //
  // In caso di successo: rimuove l'utente dallo stato (setUser(null))
  // In caso di errore: salva il messaggio di errore e rilancia l'eccezione
  const logout = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      // POST /api/esci: il backend invalida il cookie di sessione
      const response = await axios.post("/api/esci");

      // Usa il messaggio del backend se disponibile, altrimenti un fallback
      const message =
        response.data.message || "Logout effettuato con successo.";
      setMessage(message);
      setIsLoading(false);

      // Rimuove l'utente dallo stato: da questo momento tutti i componenti
      // che leggono "user" tramite useAuth() riceveranno null
      setUser(null);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Si è verificato un errore durante il logout.",
      );
      throw err; // rilancia l'errore al componente chiamante che si occuperà della grafica
    }
  };

  // ----------------------------------------------------------
  // FUNZIONE: clearError
  // ----------------------------------------------------------
  // Azzera il messaggio di errore corrente.
  // Utile quando l'utente inizia a correggere un campo dopo un errore:
  // il messaggio sparisce non appena comincia a riscrivere.
  const clearError = () => setError(null);

  // FUNZIONI: gestione finestre (Open / Close / Switch)
  // ----------------------------------------------------------
  const openLogin = () => {
    setError(null);
    setMessage(null);
    setIsSignupOpen(false); // Chiude il signup se è aperto
    setIsLoginOpen(true);   // Apre il login
  };

  const openSignup = () => {
    setError(null);
    setMessage(null);
    setIsLoginOpen(false);   // Chiude il login se è aperto
    setIsSignupOpen(true);  // Apre il signup
  };

  const closeAuth = () => {
    setError(null);
    setMessage(null);
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  // FUNZIONE: toggleFavorite  -_>Aggiunge o rimuove un film dai preferiti dell'utente corrente.
  const toggleFavorite = async (movieId) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/favorite-api/favouriteToggle", { movieId });

      setUser({
        username: user.username,
        email: user.email,
        password: user.password,
        favoriteMovies: response.data.favoriteMovies, // o response.data.favoriteMovies a seconda del tuo backend
      });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Impossibile aggiornare i preferiti in questo momento.",
      );
      throw err; // Rilancia l'errore se un componente locale vuole gestirlo (es. mostrare un toast)
    }
  };

  // ----------------------------------------------------------
  // EFFETTO: verifica sessione all'avvio
  // ----------------------------------------------------------
  // useEffect(fn, []) esegue fn UNA SOLA VOLTA, subito dopo che
  // il componente viene montato (cioè all'avvio dell'applicazione).
  // L'array vuoto [] significa "nessuna dipendenza": non rieseguire
  // mai più questo effetto, solo la prima volta.
  //
  // Scopo: controllare subito se l'utente era già loggato
  // (cookie di sessione presente) prima ancora che faccia qualsiasi azione.
  useEffect(() => {
    // eslint-disable-next-line
    fetchUser();
  }, []);

  // ----------------------------------------------------------
  // RETURN: il Provider con il valore condiviso
  // ----------------------------------------------------------
  // AuthContext.Provider è il componente che React ci dà gratis
  // quando creiamo un contesto. Il suo unico scopo è rendere
  // disponibile "value" a tutti i componenti discendenti
  // (figli, nipoti, pronipoti...) tramite useAuth().
  //
  // Tutto ciò che è nell'oggetto "value" sarà accessibile
  // da qualsiasi componente dell'app con: const { user, login, ... } = useAuth()
  return (
    <AuthContext.Provider
      value={{
        user, // dati dell'utente loggato (o null)
        setUser, // permette di aggiornare l'utente dall'esterno se necessario
        fetchingUser, // true mentre verifichiamo la sessione all'avvio
        isLoading, // true mentre una richiesta HTTP è in corso
        error, // messaggio di errore corrente (o null)
        message, // messaggio di successo corrente (o null)
        signup, // funzione per registrare un nuovo utente
        login, // funzione per autenticare un utente esistente
        logout, // funzione per terminare la sessione
        clearError, // funzione per azzerare il messaggio di errore
        isLoginOpen,
        isSignupOpen,
        openLogin,
        openSignup,
        closeAuth,
        toggleFavorite //LOGICA DEI PREFERITI GLOBALE
      }}
    >
      {/* "children" è tutto ciò che viene scritto dentro <AuthProvider>
          in main.jsx — cioè <App /> e quindi tutta l'applicazione.
          Renderizzandolo qui dentro, tutti i componenti figli hanno
          accesso al contesto sopra definito. */}
      {children}
    </AuthContext.Provider>
  );
}

// ------------------------------------------------------------
// HOOK: useAuth
// ------------------------------------------------------------
// Questo è lo strumento che useranno tutti i componenti dell'app
// per accedere al contesto di autenticazione.
//
// Invece di scrivere ogni volta:
//   import { useContext } from "react"
//   import { AuthContext } from "./AuthContext"
//   const auth = useContext(AuthContext)
//
// Basterà scrivere:
//   import { useAuth } from "./AuthContext"
//   const { user, login, logout } = useAuth()
//
// ESEMPIO D'USO in un componente:
//   function Navbar() {
//     const { user, logout } = useAuth();
//     return user
//       ? <button onClick={logout}>Esci, {user.username}</button>
//       : <a href="/login">Accedi</a>;
//   }
//
// eslint-disable-next-line
export function useAuth() {
  return useContext(AuthContext);
}
