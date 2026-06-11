import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Heart } from "lucide-react";  // libreria di icone open-source per react
import { useAuth } from "../store/authContext.jsx"; // Importa il contesto di autenticazione

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjcwM2Q5YzZmY2ViMjg5Mzg4OTMwZTYzN2JkNDA2NCIsIm5iZiI6MTc3ODM0MjY3My43MTgwMDAyLCJzdWIiOiI2OWZmNWIxMWRkZTYwM2ZmNTg1NzI0MmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hs8GxHz2S_koJDHkWqSa9hOEdsGiQWKgv1XJlVOdC3k",
  },
};

const UserPage = () => {
  const [favFilms, setFavFilms] = useState([]); //STATO LOCALE--> array vuoto inizialmente
  const [loading, setLoading] = useState(false); // STATO LOCALE-->flag che monitora stato di caricanto durante i fetch asincroni
  const { user } = useAuth(); // viene estratto l'oggetto User dal contesto globale AuthContext
  // user={dati anagrafici + film preferiti (id--> SCALABILITà E SICUREZZA)}

  useEffect(() => {
    // Se l'utente non è loggato o non ha film preferiti salvati, svuota lo stato e interrompi
    if (!user || !user.favoriteMovies || user.favoriteMovies.length === 0) {
      setFavFilms([]);
      return;
    }

    //dichiarazione
    const fetchAllFavorites = async () => { // SI POTREBBE PENSARE ANCHE DI GESTIRE TUTTO LATO BACKEND facendo una sola chiamata api al backend
      setLoading(true);
      try {
        const listaFilmElaborati = [];
        
        for (const id of user.favoriteMovies) {  // viene fatta una fetch per film
          const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
          const datiFilm = await res.json();
          // Aggiungiamo il singolo film all'array locale
          listaFilmElaborati.push(datiFilm);
        }
        // Alla fine del ciclo, salviamo tutto nello stato
        setFavFilms(listaFilmElaborati);
      } catch (err) {
        console.error("Errore nel recupero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFavorites();
  }, [user]); // Ogni volta che cambia user, viene rieseguito tutto lo useEffect

  return (
    <div className="min-h-screen bg-black text-white p-5">
      <div className="mb-6 bg-zinc-900 p-4 rounded-lg">
        <h1 className="font-bold text-2xl mb-4 text-[#ffd400]">Profilo</h1>
        <h2 className="font-medium mb-1">
          <span className="text-gray-400">Nome utente:</span> {user?.username}  {/*optional chaining--> prevede il crash se dati non sono ancora arrivati* */}
        </h2>
        {/* 2. CORRETTO: text-gray-400 sistemato */}
        <h2 className="font-medium">
          <span className="text-gray-400">Email:</span> {user?.email}
        </h2>
      </div>

      <h2 className="pb-4 font-medium text-xl flex items-center gap-2">
        <Heart className="text-red-600 fill-red-600" size={24}></Heart>I miei
        film preferiti
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {favFilms.map((item) => (
          <Link key={item.id} to={`/movie/${item.id}`}>  {/*per ogni film viene generato un tag Link indirizzato a '/movie/id' */}
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title}
              className="aspect-2/3 w-full hover:border-2 object-cover cursor-pointer"
            />
            <h2 className="text-center pt-2 text-sm truncate">{item.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserPage;

{/*
  min-h-screen: Imposta l'altezza minima della pagina pari al 100% dell'altezza dello schermo (tutto lo schermo del dispositivo).

aspect-2/3: Forza l'immagine ad avere un rapporto d'aspetto fisso di 2:3 (la classica proporzione verticale delle locandine dei film), 
  indipendentemente dalle dimensioni dello schermo.

object-cover: Dice all'immagine di riempire tutto lo spazio del suo contenitore (in questo caso il box 2:3). 
              Se le proporzioni della locandine originale non coincidono, l'immagine viene ridimensionata e ritagliata leggermente pur di non apparire schiacciata o allungata.

truncate: Gestisce i testi troppo lunghi (es. i titoli dei film). Se il titolo supera lo spazio disponibile, 
      lo taglia automaticamente inserendo i tre puntini di sospensione (...) alla fine su un'unica riga.

fill-red-600: È una classe specifica per le icone (come il cuore di Lucide-React).      
              Colora interamente l'interno dell'icona di rosso. Di base le icone nascono solo come contorno; con il fill il cuore diventa pieno
  */}
