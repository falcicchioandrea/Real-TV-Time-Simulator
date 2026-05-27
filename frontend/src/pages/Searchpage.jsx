import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjcwM2Q5YzZmY2ViMjg5Mzg4OTMwZTYzN2JkNDA2NCIsIm5iZiI6MTc3ODM0MjY3My43MTgwMDAyLCJzdWIiOiI2OWZmNWIxMWRkZTYwM2ZmNTg1NzI0MmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hs8GxHz2S_koJDHkWqSa9hOEdsGiQWKgv1XJlVOdC3k",
    },
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.results);
      })
      .catch((err) => console.error(err));
  }, [query]);

  console.log(results);
  return (
    <div className="text-black md:px-4">
      <h2 className="pb-5 pt-5 font-medium text-xl cursor-pointer">
        Stai cercando: {query}
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {results.map((item) => (
          <Link to={`/movie/${item.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title}
              className="shrink-0h-44 w-full hover:border-2 hover:border-yellow-400 object-cover cursor-pointer"
            />
            <h2 className="text-center pt-2 text-sm">{item.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
