import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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
  return <div>Stai cercando: {query}</div>;
};

export default SearchPage;
