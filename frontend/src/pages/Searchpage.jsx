import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjcwM2Q5YzZmY2ViMjg5Mzg4OTMwZTYzN2JkNDA2NCIsIm5iZiI6MTc3ODM0MjY3My43MTgwMDAyLCJzdWIiOiI2OWZmNWIxMWRkZTYwM2ZmNTg1NzI0MmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hs8GxHz2S_koJDHkWqSa9hOEdsGiQWKgv1XJlVOdC3k",
  },
};

const SearchPage = () => {
  const [searchParams] = useSearchParams(); // useSearchParams --> è un hook fornito da react-router-dom che consente di accedere e manipolare i parametri della query string presenti nell'URL.
  const query = searchParams.get("q"); // get--> preleva il valore del parametro "q"
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

  console.log(results);
  return (
    <div className="text-black md:px-4">
      <h2 className="pb-5 pt-5 font-medium text-xl">Stai cercando: {query}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
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
