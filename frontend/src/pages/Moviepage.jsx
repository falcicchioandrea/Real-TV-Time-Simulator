import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Play, Heart, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react"; // Carosello orizzontale per i film consigliati
import "swiper/css";
import { Link } from "react-router";
import { io } from "socket.io-client";
import { useAuth } from "../store/authContext";
import { Eye } from "lucide-react";

// Connessione Socket.IO creata fuori dal componente per non riaprirla ad ogni render
const socket = io(import.meta.env.VITE_BACKEND_URL);

const Moviepage = () => {
  const { id } = useParams(); // ID del film preso dall'URL
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [visualizzatori, setVisualizzatori] = useState(0);

  const { user, toggleFavorite } = useAuth();

  // È un preferito? Confronto come stringa per evitare differenze di tipo tra array e URL
  const isFavorite =
    user?.favoriteMovies?.map(String).includes(String(id)) || false;

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    };

    // Azzera gli stati quando cambia l'ID (es. click su un film consigliato)
    setMovie(null);
    setTrailerKey(null);
    setRecommendations([]);

    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((res) => res.json())
      .then((res) => setMovie(res))
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`,
      options,
    )
      .then((res) => res.json())
      .then((res) => setRecommendations(res.results || []))
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        // Cerca il primo trailer YouTube tra i video del film
        const trailer = res.results?.find(
          (video) => video.type === "Trailer" && video.site === "YouTube",
        );
        setTrailerKey(trailer?.key || null);
      })
      .catch((err) => console.error(err));
  }, [id]); // Ricarica i dati ad ogni cambio di film

  // Gestione del contatore di spettatori in tempo reale via Socket.IO
  useEffect(() => {
    // Segnala l'ingresso nella pagina del film e ascolta gli aggiornamenti del contatore
    socket.emit("entra_film", id);

    socket.on("aggiorna_contatore", (valoreAggiornato) => {
      setVisualizzatori(valoreAggiornato);
    });

    // All'uscita dalla pagina segnala l'abbandono e rimuove il listener
    return () => {
      socket.emit("esci_film", id);
      socket.off("aggiorna_contatore");
    };
  }, [id]);

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-yellow-500 text-xl">Caricamento...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Hero section */}
      <div
        className="relative h-[60vh] flex items-end md:p-8 px-2 py-8 mb-8 gap-8"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="flex items-center gap-1 text-gray-300 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            {movie.vote_average?.toFixed(1)} · {movie.release_date} ·{" "}
            {movie.runtime} min
          </p>
          <p className="flex gap-2 flex-wrap mb-3">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </p>
          {/* Badge con il numero di spettatori in tempo reale */}
          <div className="inline-flex items-center gap-2 rounded-full font-semibold">
            <Eye className="w-5 h-5" />
            <span>
              {visualizzatori}{" "}
              {visualizzatori === 1 ? "utente è qui" : "utenti sono qui"}{" "}
            </span>
          </div>
          <p className="text-gray-300 max-w-2xl mb-4">{movie.overview}</p>
          <div className="flex gap-3">
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank" // Apre il trailer in una nuova scheda
                rel="noopener noreferrer" // Buona pratica di sicurezza per i link esterni
              >
                <button className="flex items-center gap-2 bg-[#ffd400] hover:bg-[#e6bf00] text-black font-semibold py-2 px-4 rounded-full text-sm cursor-pointer">
                  <Play className="w-5 h-5" />
                  Guarda Trailer
                </button>
              </a>
            )}
            <button
              className={`flex items-center gap-2 bg-[#ffd400] hover:bg-[#e6bf00] text-black font-semibold py-2 px-4 rounded-full text-sm cursor-pointer ${
                isFavorite
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
                  : "border-neutral-300 hover:bg-[#e6bf00] text-black"
              }`}
              onClick={() => toggleFavorite(id)}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-white stroke-white" : "stroke-current"}`}
              />

              {/* Testo del bottone in base allo stato del preferito */}
              {isFavorite ? "Rimuovi dai Preferiti" : "Aggiungi ai Preferiti"}
            </button>
          </div>
        </div>
      </div>
      {/* Movie details section */}
      <div className="p-2 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Dettagli del Film</h2>
        <ul className="flex flex-wrap">
          <li className="md:w-1/3 px-2 w-1/2 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase mb-1">Stato</p>
              <p className="font-semibold">{movie.status}</p>
            </div>
          </li>

          <li className="md:w-1/3 px-2 w-1/2 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase mb-1">
                Data di uscita
              </p>
              <p className="font-semibold">{movie.release_date}</p>
            </div>
          </li>

          <li className="md:w-1/3 px-2 w-1/2 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase mb-1">
                Lingua originale
              </p>
              <p className="font-semibold">
                {movie.original_language?.toUpperCase()}
              </p>
            </div>
          </li>

          <li className="md:w-1/3 px-2 w-1/2 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase mb-1">Tagline</p>
              <p className="font-semibold italic">
                {movie.tagline || "Nessuna tagline disponibile"}
              </p>
            </div>
          </li>

          <li className="md:w-1/3 px-2 w-1/2 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase mb-1">Budget</p>
              <p className="font-semibold">
                ${movie.budget?.toLocaleString() || "Nessun budget disponibile"}
              </p>
            </div>
          </li>

          <li className="md:w-1/3 px-2 w-1/2 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase mb-1">Incasso</p>
              <p className="font-semibold">
                $
                {movie.revenue?.toLocaleString() ||
                  "Nessun incasso disponibile"}
              </p>
            </div>
          </li>
        </ul>
      </div>
      {/* Recommendations section */}
      <div className="p-2 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Film Consigliati</h2>
        <Swiper slidesPerView="auto" spaceBetween={16}>
          {recommendations.map((item) => (
            <SwiperSlide key={item.id} style={{ width: "128px" }}>
              <Link to={`/movie/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="h-44 w-full hover:border-2 object-cover cursor-pointer"
                />
              </Link>
              <h2 className="text-center pt-2 text-sm">{item.title}</h2>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Moviepage;
