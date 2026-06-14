import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Heart } from "lucide-react";
import { useAuth } from "../store/authContext.jsx";

// Pagina profilo: mostra i dati dell'utente e la sua lista di film preferiti
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
};

const UserPage = () => {
  const [favFilms, setFavFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Recupera da TMDB i dettagli di ogni film salvato tra i preferiti dell'utente
  useEffect(() => {
    if (!user || !user.favoriteMovies || user.favoriteMovies.length === 0) {
      setFavFilms([]);
      return;
    }

    const fetchAllFavorites = async () => {
      setLoading(true);
      try {
        const listaFilmElaborati = [];

        for (const id of user.favoriteMovies) {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
            options,
          );
          const datiFilm = await res.json();
          listaFilmElaborati.push(datiFilm);
        }
        setFavFilms(listaFilmElaborati);
      } catch (err) {
        console.error("Errore nel recupero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFavorites();
  }, [user]); // Si rigenera la lista ogni volta che cambiano i preferiti

  return (
    <div className="min-h-screen bg-black text-white p-5">
      <div className="mb-6 bg-zinc-900 p-4 rounded-lg">
        <h1 className="font-bold text-2xl mb-4 text-[#ffd400]">Profilo</h1>
        <h2 className="font-medium mb-1">
          <span className="text-gray-400">Nome utente:</span> {user?.username}
        </h2>
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
          <Link key={item.id} to={`/movie/${item.id}`}>
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
