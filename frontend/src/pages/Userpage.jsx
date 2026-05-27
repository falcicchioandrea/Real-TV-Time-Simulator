import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";

const UserPage = () => {
  const [favFilms, setFavFilms] = useState([]);
    
  const options = { 
    method: "GET", 
    headers: {
      accept: "application/json", 
      Authorization: 
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjcwM2Q5YzZmY2ViMjg5Mzg4OTMwZTYzN2JkNDA2NCIsIm5iZiI6MTc3ODM0MjY3My43MTgwMDAyLCJzdWIiOiI2OWZmNWIxMWRkZTYwM2ZmNTg1NzI0MmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hs8GxHz2S_koJDHkWqSa9hOEdsGiQWKgv1XJlVOdC3k",
    },
  };

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1", options)
      .then((res) => res.json()) 
      .then((res) => setFavFilms(res.results))
      .catch((err) => console.error(err));
  }, []); // L'array vuoto qui è vitale per bloccare il loop infinito!

  return (
    <div className="min-h-screen bg-black text-white p-6"> 
      <h1 className="font-bold text-2xl mb-4 text-[#ffd400]"><Profilo></Profilo></h1>
      
      <div className="mb-6 bg-zinc-900 p-4 rounded-lg inline-block">
        <h2 className="text-base mb-1"><span className="text-gray-400">Nome utente:</span> Utente_Test</h2>
        <h2 className="text-base"><span className="text-gray-4700">Email:</span> test@email.com</h2>
      </div>

      <h2 className="pb-4 font-medium text-xl">I miei film preferiti</h2>
      
      <Swiper slidesPerView="auto" spaceBetween={16}> 
        {favFilms.map((item) => (
          <SwiperSlide key={item.id} style={{ width: "128px" }}>
            <Link to={`/movie/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="h-44 w-full hover:border-2 hover:border-yellow-400 object-cover cursor-pointer rounded-md"
              />
            </Link>
            <h2 className="text-center pt-2 text-sm truncate">{item.title}</h2>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UserPage;