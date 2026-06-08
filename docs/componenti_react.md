# Componenti React

L'interfaccia è costruita con **React** (Vite) e organizzata in due categorie: pagine e componenti.

Lo stato di autenticazione è gestito tramite Context.

## Pagine (`src/pages/`)

| Componente   | Route                | Descrizione                                                                                                                                                                                                                 |
| ------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Homepage`   | `/`                  | Pagina principale. Compone `Hero` e `CardList`.                                                                                                                                                                             |
| `Moviepage`  | `/movie/:id`         | Scheda dettaglio di un film. Mostra immagini, valutazione, generi, trailer YouTube, film consigliati e il contatore di spettatori in tempo reale con **Socket.IO**. Permette di aggiungere/rimuovere il film dai preferiti. |
| `Searchpage` | `/search?q=...`      | Griglia di risultati per la ricerca tramite API TMDB .                                                                                                                                                                      |
| `UserPage`   | `/profile/:username` | Profilo utente con riepilogo delle informazioni e griglia dei film preferiti.                                                                                                                                               |

### Componenti (`src/components/`)

| Componente      | Descrizione                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Navbar`        | Barra di navigazione con logo, campo di ricerca e menu dilogin/sign-up/logout.                                     |
| `Hero`          | Banner nella homepage con titolo di benvenuto, lista delle feature e pulstante registrazione (se non autenticati). |
| `CardList`      | Quattro carousel orizzontali (con componente **Swiper.js**) per le categorie TMDB.                                 |
| `LoginModal`    | Overlay modale per il login con form username/password.                                                            |
| `RegisterModal` | Overlay modale per la registrazione con form username/email/password/conferma password.                            |
| `Footer`        | Barra in fondo alla pagina.                                                                                        |

### Gestione dello Stato (`src/store/`)

| File              | Descrizione                                                                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authContext.jsx` | Context di autenticazione. Espone: `user`, `login`, `signup`, `logout`, `toggleFavorite`, `isLoading`, `error`, `clearError`, `isLoginOpen`, `isSignupOpen`, `openLogin`, `openSignup`, `closeAuth`. |
