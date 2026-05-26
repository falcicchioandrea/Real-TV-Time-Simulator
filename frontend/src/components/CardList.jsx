import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router";

const CardList = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

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
    <div className="text-black md:px-4">
      <div>
        <h2 className="pb-5 pt-5 font-medium text-xl cursor-pointer">
          Di tendenza
        </h2>
        <Swiper slidesPerView="auto" spaceBetween={16}>
          {nowPlaying.map((item) => (
            <SwiperSlide key={item.id} style={{ width: "128px" }}>
              <Link to={`/movie/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="h-44 w-full hover:border-2 hover:border-yellow-400 object-cover cursor-pointer"
                />
              </Link>
              <h2 className="text-center pt-2 text-sm">{item.title}</h2>
            </SwiperSlide>
          ))}
        </Swiper>

        <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">
          Popolari
        </h2>
        <Swiper slidesPerView="auto" spaceBetween={16}>
          {popular.map((item) => (
            <SwiperSlide key={item.id} style={{ width: "128px" }}>
              <Link to={`/movie/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="h-44 w-full hover:border-2 hover:border-yellow-400 object-cover cursor-pointer"
                />
              </Link>
              <h2 className="text-center pt-2 text-sm">{item.title}</h2>
            </SwiperSlide>
          ))}
        </Swiper>

        <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">
          Le Serie TV più viste
        </h2>
        <Swiper slidesPerView="auto" spaceBetween={16}>
          {topRated.map((item) => (
            <SwiperSlide key={item.id} style={{ width: "128px" }}>
              <Link to={`/movie/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="h-44 w-full hover:border-2 hover:border-yellow-400 object-cover cursor-pointer"
                />
              </Link>
              <h2 className="text-center pt-2 text-sm">{item.title}</h2>
            </SwiperSlide>
          ))}
        </Swiper>

        <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">
          I Film più visti
        </h2>
        <Swiper slidesPerView="auto" spaceBetween={16} className="pb-5">
          {upcoming.map((item) => (
            <SwiperSlide key={item.id} style={{ width: "128px" }}>
              <Link to={`/movie/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="h-44 w-full hover:border-2 hover:border-yellow-400 object-cover cursor-pointer"
                />
              </Link>
              <h2 className="text-center pt-2 text-sm">{item.title}</h2>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CardList;
