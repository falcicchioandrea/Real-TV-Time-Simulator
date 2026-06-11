import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // componenti per far scorrere film ; Swiper è il contenitore principale che gestisce lo scorrimento, mentre SwiperSlide rappresenta ogni singolo elemento (in questo caso, ogni film) all'interno dello scorrimento.
import "swiper/css"; // Importa gli stili CSS di base per il funzionamento di Swiper, che includono le regole necessarie per il layout e l'animazione dello scorrimento. Senza questa importazione, lo scorrimento potrebbe non funzionare correttamente o non essere visualizzato come previsto.
import { Link } from "react-router";

const options = {
  // Opzioni per la richiesta fetch e gli headers
  method: "GET",
  headers: {
    accept: "application/json", // Indica che il client si aspetta una risposta in formato JSON dal server.
    // Fornisce un token di autorizzazione per autenticare la richiesta al server. In questo caso, è un token JWT (JSON Web Token) che consente l'accesso alle risorse protette dell'API. Il token viene passato come stringa nell'intestazione Authorization, preceduto dalla parola "Bearer" per indicare il tipo di token utilizzato. SENZA questo token, la richiesta SAREBBE RIFIUTATA dal server (401 Unauthorized)
    Authorization:
      `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
};

const CardList = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1", // fetch è una funzione JavaScript che consente di effettuare richieste HTTP asincrone a un server.
      options,
    )
      .then((res) => res.json())
      .then((res) => setNowPlaying(res.results))
      .catch((err) => console.error(err));

    fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options,
    )
      .then((res) => res.json())
      .then((res) => setPopular(res.results))
      .catch((err) => console.error(err));

    fetch(
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
      options,
    )
      .then((res) => res.json())
      .then((res) => setTopRated(res.results))
      .catch((err) => console.error(err));

    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      options,
    )
      .then((res) => res.json())
      .then((res) => setUpcoming(res.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-[#181818] text-white px-2">
      {/* 1. Array di configurazione dinamico */}
      {[
        { titolo: "Film di tendenza", dati: nowPlaying },
        { titolo: "Film popolari", dati: popular },
        { titolo: "Film più votati", dati: topRated },
        { titolo: "Film in arrivo", dati: upcoming }
      ].map((categoria, index) => (  // categoria rappresenta ogni oggetto dell'array, mentre index è la posizione dell'oggetto all'interno dell'array (0, 1, 2, 3). L'index viene utilizzato come chiave unica per ogni categoria durante il rendering.
        
        // 2. Unico blocco ripetuto dinamicamente per ogni categoria
        <div key={index} className="pb-4">
          <h2 className="pb-5 pt-5 font-medium text-xl cursor-pointer">
            {categoria.titolo}
          </h2>
          
          <Swiper slidesPerView="auto" spaceBetween={16}>
            {categoria.dati.map((item) => (
              <SwiperSlide key={item.id} style={{ width: "128px" }}>
                <Link to={`/movie/${item.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                    className="aspect-2/3 hover:border-2 object-cover cursor-pointer"
                  />
                </Link>
                {/* La classe 'truncate' impedisce ai titoli lunghi di sballare l'altezza su smartphone */}
                <h2 className="text-center pt-2 text-sm" title={item.title}>
                  {item.title}
                </h2>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default CardList;
