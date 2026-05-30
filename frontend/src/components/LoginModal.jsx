import { useState } from "react";
import { useAuth } from "../store/authContext.jsx";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Estrazione delle funzioni dal context
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impedisce il comportamento predefinito del form (ricaricare la pagina)
    try {
      await login(username, password); // Chiama la funzione di login dal context
      onClose(); // Chiude il modal dopo un login riuscito
    } catch {
      // L'errore viene gestito altrove
    }
  };

  // Se isOpen è falso, non viene visualizzata interfaccia Login
  if (!isOpen) return null;

  console.log("Username: ", username, "Password: ", password);

  return (
    //Sfondo in sovrimpressione
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 m-4 w-96 h-auto p-8 rounded-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          X
        </button>
        <h2 className="text-xl text-center font-bold text-white mb-4">
          Accedi al tuo account
        </h2>
        {/* Form di login */}
        <form
          className="flex flex-col gap-4 text-white"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          {/* Mostra il messaggio di errore se presente */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading} // Disabilita il pulsante durante il caricamento
            className=" font-bold text-black bg-[#ffd400] mr-20 ml-20 rounded-lg hover:bg-yellow-500 cursor-pointer transition-colors p-1"
          >
            {isLoading ? "Caricamento..." : "Accedi"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-2 text-center">
          Non hai un account?&nbsp;{" "}
          {/* &nbsp; --> è un'entità HTML che rappresenta uno spazio non interruzione (andare a capo), utilizzata per aggiungere spazi tra gli elementi senza permettere l'interruzione di linea.*/}
          <span
            onClick={onSwitchToRegister}
            className="text-[#ffd400] font-semibold cursor-pointer hover:underline "
          >
            Registrati
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
