import Logo from "../assets/logo.png";
import { Search, User } from "lucide-react"; // Importa l'icona di ricerca da lucide-react come se fosse un componente React
import { Link, useNavigate } from "react-router"; // Importa il componente Link da react-router per la navigazione tra le pagine
import { useState } from "react";
import { useAuth } from "../store/authContext.jsx";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      // .trim() rimuove gli spazi bianchi all'inizio e alla fine della stringa, assicurandosi che la ricerca non venga eseguita se l'utente ha inserito solo spazi
      navigate(`/search?q=${searchQuery.trim()}`); // Naviga alla pagina di ricerca con la query come parametro nella URL
    }
  };

  const resetFormValue = () => setSearchQuery("");

  // Estrazione
  const { user, logout, openSignup, openLogin } = useAuth();

  // FUNZIONE/HANDLE: Gestisce il click sul pulsante Esci
  const handleLogout = async () => {
    try {
      // 1. Aspettiamo che il context distrugga la sessione sul backend e svuoti lo stato 'user'
      await logout();
      // 2. Una volta completato il logout, reindirizziamo l'utente alla Home Page
      navigate("/");
    } catch (err) {
      // L'errore è già salvato nel context, ma facciamo un log per il debugging locale
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
              onKeyDown={handleSearch} // onKeyDown--> Rileva le lettere, i numeri, le frecce direzionali, la barra spaziatrice, ma anche i tasti "invisibili" o di sistema che non scrivono testo
              onBlur={resetFormValue} // Resetta il valore del campo di ricerca quando perde focus
            />
          </div>
        </div>
        {/* Gruppo destro */}
        {user ? ( // se user esiste (quindi è loggato) mostra:
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
          // se non è loggato mostra:
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
