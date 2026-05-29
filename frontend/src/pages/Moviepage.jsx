import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Play, Heart } from "lucide-react";

const Moviepage = () => {
  const { id } = useParams(); // useParams è un hook fornito da react-router-dom che consente di accedere ai parametri dinamici presenti nell'URL. In questo caso, viene utilizzato per estrarre l'id del film dalla URL, che è necessario per effettuare le richieste API e recuperare i dettagli del film specifico da visualizzare sulla pagina.
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjcwM2Q5YzZmY2ViMjg5Mzg4OTMwZTYzN2JkNDA2NCIsIm5iZiI6MTc3ODM0MjY3My43MTgwMDAyLCJzdWIiOiI2OWZmNWIxMWRkZTYwM2ZmNTg1NzI0MmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hs8GxHz2S_koJDHkWqSa9hOEdsGiQWKgv1XJlVOdC3k",
    },
  };

  useEffect(() => {
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
        const trailer = res.results?.find(    // ? --> è l'operatore di optional chaining in JavaScript, che consente di accedere in modo sicuro senza causare errori. FIND --> è un metodo degli array in JavaScript che restituisce il primo elemento dell'array che soddisfa una condizione specificata in una funzione di callback.
          (video) => video.type === "Trailer" && video.site === "YouTube",
        );
        setTrailerKey(trailer?.key || null); // KEY --> identificatore univoco del video su YouTube, che viene utilizzato per costruire l'URL del trailer. 
      })
      .catch((err) => console.error(err));
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
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-[#181818] via-[#181818]/40 to-transparent" />

        {/* Movie image poster */}
        <img
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          className="relative z-10 shrink-0 rounded-lg shadow-lg w-48 hidden md:block"
          alt={movie.title}
        />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-300 mb-2">
            {movie.vote_average?.toFixed(1)} · {movie.release_date} ·{" "}  {/* toFixed(1) --> arrotonda il numero ad una cifra decimale */}
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
            <button className="flex items-center gap-2 font-semibold py-2 px-4 rounded-full text-sm border transition-colors cursor-pointer hover:bg-[#e6bf00]">
              <Heart className={"*:w-5 h-5"} /> Add to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moviepage;
