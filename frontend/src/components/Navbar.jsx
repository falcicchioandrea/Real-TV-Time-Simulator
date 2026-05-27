import Logo from "../assets/logo.png";
import { Search } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onOpenLoginModal, onOpenRegisterModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery.trim()}`); // Reindirizza alla pagina di ricerca con la query
    }
  };

  return (
    <>
      <nav className="relative z-50 bg-[#ffd400] text-black flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
        {/*  Gruppo sinistro*/}
        <div className="flex items-center space-x-4 relative">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="w-40 cursor-pointer brightness-125"
            />
          </Link>
          <div className="flex items-center border-b border-black">
            /* Campo di ricerca, bisogna impostare un useState per la query,
            useNavigate per reindirizzare e il submit */
            <Search size={16} className="mr-2" />
            <input
              className="bg-transparent outline-none text-black placeholder-black/70 w-full"
              type="text"
              aria-label="Cerca titoli"
              placeholder="Cerca titoli"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch} // Esegue la ricerca quando l'utente preme Invio
            />
          </div>
        </div>
        {/* Gruppo destro */}
        <div className="flex items-center space-x-4 relative">
          <button
            className="cursor-pointer px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
            onClick={() => onOpenLoginModal()}
          >
            Accedi
          </button>
          <span className="text-black/50">|</span>
          <button
            className="cursor-pointer px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
            onClick={() => onOpenRegisterModal()}
          >
            Registrati
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
