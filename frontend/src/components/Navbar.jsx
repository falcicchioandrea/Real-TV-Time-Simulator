import Logo from "../assets/logo.png";
import { Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../store/authContext.jsx";

// Barra di navigazione: logo, ricerca e pulsanti di login/logout in base allo stato utente
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Premendo Invio, naviga alla pagina di ricerca con il testo digitato
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  };

  const resetFormValue = () => setSearchQuery("");

  const { user, logout, openSignup, openLogin } = useAuth();

  // Esegue il logout e riporta l'utente alla home
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(
        "Errore durante il reindirizzamento post-logout:",
        err.message,
      );
    }
  };

  return (
    <>
      <nav className="relative bg-[#ffd400] text-black flex justify-between items-center h-18 px-0.5 py-5 md:p-4 text-sm md:text-[15px] font-medium">
        {/*  Gruppo sinistro*/}
        <div className="flex items-center">
          <Link to="/">
            <img src={Logo} alt="Logo" className="w-40 cursor-pointer pr-3" />
          </Link>
          <div className="flex items-center border-b border-black w-32 md:w-60">
            <Search size={16} className="mr-2" />
            <input
              className="bg-transparent outline-none text-black placeholder-black/70 w-full"
              type="text"
              aria-label="Cerca titoli"
              placeholder="Cerca titoli"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              onBlur={resetFormValue} // Svuota il campo quando perde il focus
            />
          </div>
        </div>
        {/* Gruppo destro: profilo + logout se loggato, altrimenti accedi/registrati */}
        {user ? (
          <div className="flex items-center gap-3 relative">
            <Link to={`/profile/${user.username}`}>
              <button className="cursor-pointer px-3 py-1 rounded-md hover:bg-[black] hover:text-white flex items-center gap-2">
                <User size={20} />
                {user.username}
              </button>
            </Link>
            <button
              className="cursor-pointer px-3 py-1 rounded-md hover:bg-[red] hover:text-white"
              onClick={handleLogout}
            >
              Esci
            </button>
          </div>
        ) : (
          <div className="flex items-center gap:4 sm:gap-1 relative">
            <button
              className="cursor-pointer px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
              onClick={openLogin}
            >
              Accedi
            </button>
            <span className="text-black/50">|</span>
            <button
              className="cursor-pointer px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
              onClick={openSignup}
            >
              Registrati
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
