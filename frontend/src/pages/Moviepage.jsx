import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Play, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react"; // componenti per far scorrere film ; Swiper è il contenitore principale che gestisce lo scorrimento, mentre SwiperSlide rappresenta ogni singolo elemento (in questo caso, ogni film) all'interno dello scorrimento.
import "swiper/css"; // Importa gli stili CSS di base per il funzionamento di Swiper, che includono le regole necessarie per il layout e l'animazione dello scorrimento. Senza questa importazione, lo scorrimento potrebbe non funzionare correttamente o non essere visualizzato come previsto.
import { Link } from "react-router";
import { handleToggleFavorite } from "../../handles/handleFavorites";

const Moviepage = () => {
  const { id } = useParams(); // useParams è un hook fornito da react-router-dom che consente di accedere ai parametri dinamici presenti nell'URL. In questo caso, viene utilizzato per estrarre l'id del film dalla URL, che è necessario per effettuare le richieste API e recuperare i dettagli del film specifico da visualizzare sulla pagina.
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjcwM2Q5YzZmY2ViMjg5Mzg4OTMwZTYzN2JkNDA2NCIsIm5iZiI6MTc3ODM0MjY3My43MTgwMDAyLCJzdWIiOiI2OWZmNWIxMWRkZTYwM2ZmNTg1NzI0MmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hs8GxHz2S_koJDHkWqSa9hOEdsGiQWKgv1XJlVOdC3k",
      },
    };
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
        const trailer = res.results?.find(
          // ? --> è l'operatore di optional chaining in JavaScript, che consente di accedere in modo sicuro senza causare errori. FIND --> è un metodo degli array in JavaScript che restituisce il primo elemento dell'array che soddisfa una condizione specificata in una funzione di callback.
          (video) => video.type === "Trailer" && video.site === "YouTube",
        );
        setTrailerKey(trailer?.key || null); // KEY --> identificatore univoco del video su YouTube, che viene utilizzato per costruire l'URL del trailer.
      })
      .catch((err) => console.error(err));

      fetch("/user-api/fetch-user")
        .then((res) => res.json())
        .then((data) => {
          // Se l'utente è loggato e l'array contiene l'id corrente
          if (data.user && data.user.favoriteMovies?.includes(Number(id))) {
            setIsFavorite(true);
          }
        })
        .catch((err) => console.log("Utente non loggato"));
  }, [id]); // ogni volta che id cambia, vengono eseguite tutto lo useEffect

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-yellow-500 text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Hero section */}
      <div
        className="relative h-[60vh] flex items-end p-8 gap-8"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Movie image poster */}
        <img
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          className="relative z-10 shrink-0 rounded-lg shadow-lg w-48 hidden md:block"
          alt={movie.title}
        />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-300 mb-2">
            ⭐{movie.vote_average?.toFixed(1)} · {movie.release_date} ·{" "}
            {/* toFixed(1) --> arrotonda il numero ad una cifra decimale */}
            {movie.runtime} min
          </p>
          <p className="flex gap-2 flex-wrap mb-3">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id} // key--> identifica in modo univoco ogni elemento della lista, aiutando React a gestire in modo efficiente il rendering e l'aggiornamento degli elementi quando la lista cambia. In questo caso, viene utilizzato genre.id come chiave unica per ogni genere.
                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </p>
          <p className="text-gray-300 max-w-2xl mb-4">{movie.overview}</p>
          <div className="flex gap-3">
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank" //blank --> apre il link in una nuova scheda del browser
                rel="noopener noreferrer" //noopener --> imposta window.opener=null, eliminando il riferimento alla pagina originale e prevenendo potenziali attacchi di phishing. noreferrer --> impedisce al browser di inviare l'intestazione Referer al sito di destinazione, proteggendo ulteriormente la privacy dell'utente.
              >
                <button className="flex items-center gap-2 bg-[#ffd400] hover:bg-[#e6bf00] text-black font-semibold py-2 px-4 rounded-full text-sm cursor-pointer">
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </button>
              </a>
            )}
            <button 
              className="flex items-center gap-2 font-semibold py-2 px-4 rounded-full text-sm border transition-colors cursor-pointer ${isFavorite ? 'bg-red-600 border-red-600 hover:bg-red-700' : 'hover:bg-[#e6bf00]'}"
              onClick={handleToggleFavorite}>
              <Heart className={`w-5 h-5 ${isFavourite ? "fill-red-600 ì" : "" }`}/> Add to Favorites
            </button>
          </div>
        </div>
      </div>
      {/* Movie details section */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Dettagli del Film</h2>
        <ul className="grid grid-rows-2 grid-flow-col gap-4 max-w-lg">
          <li className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Stato</p>
            <p className="font-semibold">{movie.status}</p>
          </li>
          <li className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">
              Data di uscita
            </p>
            <p className="font-semibold">{movie.release_date}</p>
          </li>
          <li className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">
              Lingua originale
            </p>
            <p className="font-semibold">
              {movie.original_language?.toUpperCase()}
            </p>
          </li>
          <li className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Tagline</p>
            <p className="font-semibold italic">
              {movie.tagline || "Nessuna tagline disponibile"}
            </p>
          </li>
          <li className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Budget</p>
            <p className="font-semibold">
              ${movie.budget?.toLocaleString() || "Nessun budget disponibile"}
            </p>
          </li>
          <li className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Incasso</p>
            <p className="font-semibold">
              ${movie.revenue?.toLocaleString() || "Nessun incasso disponibile"}
            </p>
          </li>
        </ul>
      </div>
      {/* Recommendations section */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Film Consigliati</h2>
        <Swiper slidesPerView="auto" spaceBetween={16}>
          {" "}
          {/* slidesPerView="auto" consente a Swiper di calcolare automaticamente il numero di slide da visualizzare in base alla larghezza del contenitore e alla larghezza di ogni slide. spaceBetween={16} aggiunge uno spazio di 16 pixel tra ogni slide, migliorando la leggibilità e l'estetica dello scorrimento. Queste opzioni insieme permettono di creare un layout fluido e adattabile per la visualizzazione dei film. */}
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
