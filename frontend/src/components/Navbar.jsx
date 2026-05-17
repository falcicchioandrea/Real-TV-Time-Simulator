import Logo from "../assets/logo.png";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import genres from "../data/genres.json";

const Navbar = ({ onOpenLoginModal, onOpenRegisterModal }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };
  return (
    <>
      <nav className="relative z-50 bg-[#ffd400] text-black flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap" 
        onMouseLeave={() => setOpenMenu(null)}>
        {/*  Gruppo sinistro*/}
        <div className="flex items-center space-x-4 relative">
          <img
            src={Logo}
            alt="Logo"
            className="w-40 cursor-pointer brightness-125"
            onClick={() => toggleMenu(null)}
          />
          <ul className="hidden md:flex space-x-6">
            <div className="relative">
              <li
                className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
                onClick={() => toggleMenu("serie")}
              >
                Serie{" "}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openMenu === "serie" ? "rotate-180" : ""}`}
                />
              </li>
              {openMenu === "serie" && (
                <ul className="absolute top-full left-0 mt-2 bg-black shadow-md rounded w-40 z-50 p-2">
                  <li className="px-4 py-2 hover:bg-[#ffd400] hover:text-black hover:rounded cursor-pointer relative text-white">
                    Di tendenza
                  </li>
                  <li className="px-4 py-2 hover:bg-[#ffd400] hover:text-black hover:rounded cursor-pointer relative text-white">
                    I più aggiunti
                  </li>
                  <li className="px-4 py-2 hover:bg-[#ffd400] hover:text-black hover:rounded cursor-pointer relative text-white">
                    Più visti
                  </li>
                  <li className="px-4 py-2 hover:bg-[#ffd400] hover:text-black hover:rounded cursor-pointer relative text-white">
                    Le più viste
                  </li>
                </ul>
              )}
            </div>
            <div className="relative">
              <li
                className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
                onClick={() => toggleMenu("film")}
              >
                Film <ChevronDown size={14} />
              </li>
              {openMenu === "film" && (
                <ul className="absolute top-full left-0 mt-2 bg-black shadow-md rounded w-40 z-50 p-2">
                  <li className="px-4 py-2 hover:bg-[#ffd400] hover:text-black hover:rounded cursor-pointer relative text-white">
                    Di tendenza
                  </li>
                  <li className="px-4 py-2 hover:bg-[#ffd400] hover:text-black hover:rounded cursor-pointer relative text-white">
                    I più aggiunti
                  </li>
                </ul>
              )}
            </div>

            <div className="relative">
              <li
                className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
                onClick={() => toggleMenu("generi")}
              >
                Generi <ChevronDown size={14} />
              </li>
              {openMenu === "generi" && (
                <ul className="absolute top-full left-0 mt-2 bg-black shadow-md rounded z-50 grid grid-cols-4 gap-x-8 gap-y-1 p-4 w-[750px]">
                  {/* Mappa ogni genere e crea un elemento della lista per ciascuno */}
                  {genres.map((genre) => (
                    <li
                      key={genre} // key serve a identificare ogni elemento della lista
                      className="px-4 py-2 hover:bg-[#ffd400] hover:text-black hover:rounded cursor-pointer relative text-white"
                    >
                      {genre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ul>
          <div className="flex items-center border-b border-black">
            <Search size={16} className="mr-2" />
            <input
              className="bg-transparent outline-none text-black placeholder-black/70 w-full"
              type="text"
              aria-label="Cerca titoli"
              placeholder="Cerca titoli"
            />
          </div>
        </div>
        {/* Gruppo destro */}
        <div className="flex items-center space-x-4 relative">
          <button className="cursor-pointer px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
            onClick={() => onOpenLoginModal()}
          >
            Accedi
          </button>
          <span className="text-black/50" >|</span>
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
