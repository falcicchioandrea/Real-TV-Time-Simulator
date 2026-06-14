import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Caroselli orizzontali scorrevoli
import "swiper/css";
import { Link } from "react-router";

// Header comuni per le chiamate all'API TMDB (token di autorizzazione)
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
};

const CardList = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  // Carica dall'API TMDB le quattro categorie di film mostrate in homepage
  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
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
      {/* Genera un carosello per ogni categoria di film */}
      {[
        { titolo: "Film di tendenza", dati: nowPlaying },
        { titolo: "Film popolari", dati: popular },
        { titolo: "Film più votati", dati: topRated },
        { titolo: "Film in arrivo", dati: upcoming }
      ].map((categoria, index) => (
        <div key={index} className="pb-4">
          <h2 className="pb-5 pt-5 font-medium text-xl cursor-pointer inline-block">
            {categoria.titolo}
          </h2>
          
          <Swiper slidesPerView="auto" spaceBetween={16}>
            {categoria.dati.map((item) => (
              <SwiperSlide key={item.id} style={{ width: "128px" }}>
                <Link to={`/movie/${item.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                    className="h-44 w-full hover:border-2 object-cover cursor-pointer"
                  />
                </Link>
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
