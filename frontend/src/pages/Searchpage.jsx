import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router";

// Pagina di ricerca: interroga TMDB con il termine passato nella query string (?q=)
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // Termine di ricerca preso dall'URL
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.results);
      })
      .catch((err) => console.error(err));
  }, [query]);

  const filteredResults = results
    .filter((item) => item?.poster_path)
    .filter((item) => item?.title);

  return (
    <div className="text-black md:px-4">
      <h2 className="pb-5 pt-5 font-medium text-xl">Stai cercando: {query}</h2>
      <div className="grid grid-cols-3 px-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {filteredResults.length === 0 ? (
          <div className="flex items-center justify-center col-span-full h-screen">
            <h3 className="text-lg font-medium">Nessun risultato trovato</h3>
          </div>
        ) : (
          filteredResults.map((item) => (
            <Link key={item.id} to={`/movie/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="aspect-2/3 w-full hover:border-2 object-cover cursor-pointer"
              />
              <h2 className="text-center pt-2 pb-3 text-sm">{item.title}</h2>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
