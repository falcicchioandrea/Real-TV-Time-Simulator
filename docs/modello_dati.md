# Modello Dati

L'applicazione utilizza **MongoDB** come database. I dati sui film non vengono memorizzati localmente, ma vengono recuperati dall'API di **TMDB**.
L'unica informazione che viene mantenuta nel database è la lista degli ID dei film che l'utente decide di salvare.

| Campo            | Tipo       | Obbligatorio | Default | Descrizione                                         |
| ---------------- | ---------- | :----------: | :-----: | --------------------------------------------------- |
| `username`       | `String`   |      ✓       |    —    | Nome utente univoco scelto in fase di registrazione |
| `email`          | `String`   |      ✓       |    —    | Indirizzo email univoco dell'utente                 |
| `password`       | `String`   |      ✓       |    —    | Password cifrata con **bcrypt**                     |
| `favoriteMovies` | `[Number]` |      ✗       |  `[]`   | Lista degli ID TMDB dei film salvati nei preferiti  |

**Note**

- La password non viene **mai** restituita nelle risposte API.
- I dettagli dei film si ottengono con delle chiamate API a **TMDB**.
- L'autenticazione è gestita con JWT che viene salvato nei cookie in modalità `httpOnly`.
