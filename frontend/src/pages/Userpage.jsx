import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import { Heart } from "lucide-react"
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
    <div className="min-h-screen bg-black text-white p-5">
      <div className="mb-6 bg-zinc-900 p-4 rounded-lg">
        <h1 className="font-bold text-2xl mb-4 text-[#ffd400]">Profilo</h1> 
        <h2 className="font-medium mb-1"><span className="text-gray-400">Nome utente:</span> Utente_Test</h2>
        {/* 2. CORRETTO: text-gray-400 sistemato */}
        <h2 className="font-medium"><span className="text-gray-400">Email:</span> test@email.com</h2> 
      </div>

      <h2 className="pb-4 font-medium text-xl flex items-center gap-2">  
        <Heart className="text-red-600 fill-red-600" size={24}></Heart>
        I miei film preferiti
      </h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {favFilms.map((item) => (
          <Link key={item.id} to={`/movie/${item.id}`}>
                <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="aspect-2/3 w-full hover:border-2 object-cover cursor-pointer"
              />
          <h2 className="text-center pt-2 text-sm truncate">{item.title}</h2>
          </Link>
        ))};
      </div>
    </div>
  );
};

export default UserPage;