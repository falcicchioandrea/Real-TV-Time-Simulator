import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router";

/*
-Se sviluppi un sito web (come il tuo progetto), usi react-router-dom 
(DOM = Document Object Model, ovvero la struttura della pagina web).
-Se sviluppassi un'app per smartphone, useresti react-router-native.
-Entrambi questi pacchetti usano react-router sotto il cofano come motore comune.
*/

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjcwM2Q5YzZmY2ViMjg5Mzg4OTMwZTYzN2JkNDA2NCIsIm5iZiI6MTc3ODM0MjY3My43MTgwMDAyLCJzdWIiOiI2OWZmNWIxMWRkZTYwM2ZmNTg1NzI0MmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hs8GxHz2S_koJDHkWqSa9hOEdsGiQWKgv1XJlVOdC3k",
  },
};

const SearchPage = () => {
  const [searchParams] = useSearchParams(); // useSearchParams --> è un hook fornito da react-router-dom che consente di accedere 
                                            //                       e manipolare i parametri della query string presenti nell'URL.
  const query = searchParams.get("q"); // get--> preleva il valore del parametro "q"--> film che stiamo ricercando nella barra
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    fetch( // prelievo di dati all'url dinamico (parametro=query)
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.results);
      })
      .catch((err) => console.error(err));
  }, [query]);  // ogni volta che l'utente digita una nuova parola

  const filteredResults = results
    .filter((item) => item?.poster_path)// filtrati oggetti con poster
    .filter((item) => item?.title); //filtrati oggetti con titolo

  console.log(results);
  return (
    <div className="text-black md:px-4">
      <h2 className="pb-5 pl-2 pt-5 font-medium text-xl">Stai cercando: {query}</h2>
      <div className="grid grid-cols-3 px-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {filteredResults.length === 0 ? (  //allora 
            <h3 className="text-lg font-medium col-span-full h-screen">Nessun risultato trovato</h3>
        ) : ( //else
          filteredResults.map((item) => (
            <Link key={item.id} to={`/movie/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="aspect-2/3 hover:border-2 object-cover cursor-pointer"
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
