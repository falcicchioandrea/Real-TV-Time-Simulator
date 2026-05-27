import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Play, Heart } from "lucide-react";

const Moviepage = () => {
  const { id } = useParams();
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
        const trailer = res.results?.find(
          (video) => video.type === "Trailer" && video.site === "YouTube",
        );
        setTrailerKey(trailer?.key || null);
      })
      .catch((err) => console.error(err));
  }, [id]);

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
          <p className="text-gray-300 max-w-2xl mb-4">{movie.overview}</p>
          <div className="flex gap-3">
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
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
