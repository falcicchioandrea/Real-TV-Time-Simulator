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
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjcwM2Q5YzZmY2ViMjg5Mzg4OTMwZTYzN2JkNDA2NCIsIm5iZiI6MTc3ODM0MjY3My43MTgwMDAyLCJzdWIiOiI2OWZmNWIxMWRkZTYwM2ZmNTg1NzI0MmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hs8GxHz2S_koJDHkWqSa9hOEdsGiQWKgv1XJlVOdC3k",
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
    <div className="text-black md:px-4">
      <div>
        <h2 className="pb-5 pt-5 font-medium text-xl cursor-pointer">
          Film di tendenza
        </h2>
        <Swiper slidesPerView="auto" spaceBetween={16}>
          {" "}
          {/* slidesPerView="auto" consente a Swiper di calcolare automaticamente il numero di slide da visualizzare in base alla larghezza del contenitore e alla larghezza di ogni slide. spaceBetween={16} aggiunge uno spazio di 16 pixel tra ogni slide, migliorando la leggibilità e l'estetica dello scorrimento. Queste opzioni insieme permettono di creare un layout fluido e adattabile per la visualizzazione dei film. */}
          {nowPlaying.map((item) => (
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

        <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">
          Film popolari
        </h2>
        <Swiper slidesPerView="auto" spaceBetween={16}>
          {popular.map((item) => (
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

        <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">
          Film più votati
        </h2>
        <Swiper slidesPerView="auto" spaceBetween={16}>
          {topRated.map((item) => (
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

        <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">
          Film in arrivo
        </h2>
        <Swiper slidesPerView="auto" spaceBetween={16} className="pb-5">
          {upcoming.map((item) => (
            <SwiperSlide key={item.id} style={{ width: "128px" }}>
              <Link to={`/movie/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="h-44 w-full hover:border-2 object-cover cursor-pointer"
                />
              </Link>
              <h2 className="text-center pt-2 pb-2 text-sm">{item.title}</h2>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CardList;
