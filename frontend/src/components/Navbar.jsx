import Logo from "../assets/logo.png";
import { Search } from "lucide-react"; // Importa l'icona di ricerca da lucide-react come se fosse un componente React
import { Link } from "react-router"; // Importa il componente Link da react-router per la navigazione tra le pagine
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Navbar = ({ onOpenLoginModal, onOpenRegisterModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); 
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {  // .trim() rimuove gli spazi bianchi all'inizio e alla fine della stringa, assicurandosi che la ricerca non venga eseguita se l'utente ha inserito solo spazi
      navigate(`/search?q=${searchQuery.trim()}`); // Naviga alla pagina di ricerca con la query come parametro nella URL
    }
  };
  const resetFormValue = () => setSearchQuery("");

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
            <Search size={16} className="mr-2" />
            <input
              className="bg-transparent outline-none text-black placeholder-black/70 w-full"
              type="text"
              aria-label="Cerca titoli"
              placeholder="Cerca titoli"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch} // onKeyDown--> Rileva le lettere, i numeri, le frecce direzionali, la barra spaziatrice, ma anche i tasti "invisibili" o di sistema che non scrivono testo
              onBlur={resetFormValue} // Resetta il valore del campo di ricerca quando perde focus
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
