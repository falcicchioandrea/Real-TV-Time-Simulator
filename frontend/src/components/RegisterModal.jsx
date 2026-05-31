import { useState, useEffect } from "react";
import { useAuth } from "../store/authContext.jsx";
import { set } from "mongoose";

const RegisterModal = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setlocalError] = useState(""); // Stato per gestire errori locali (es. password non corrispondenti)

  const { signup, isLoading, error, clearError, isSignupOpen, openSignup, openLogin, closeAuth } = useAuth();

  useEffect(() => {
    // Pulisce il messaggio di errore e azzera i campi del form quando il modal viene chiuso
    if (!isSignupOpen) {
      clearError();
      setUsername(""); 
      setEmail("");    
      setPassword(""); 
    }
  }, [isSignupOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impedisce il comportamento predefinito del form (ricaricare la pagina)
    if (password !== confirmPassword) {
      setlocalError("Le password non corrispondono!");
      return;
    }
    setlocalError(null);

    try {
      await signup(username, email, password); // Chiama la funzione di registrazione dal context
      closeAuth(); // Chiude il modal dopo una registrazione riuscita
    } catch {
      // L'errore viene gestito altrove (nella funzione sign up nel auth context)
    }
  };

  // Se isOpen è falso, non viene visualizzata interfaccia Login
  if (!isSignupOpen) return null;

  console.log(
    "Username: ",
    username,
    "Email: ",
    email,
    "Password: ",
    password,
    "Confirm Password: ",
    confirmPassword,
  );

  return (
    //Sfondo in sovrimpressione
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 m-4 w-96 h-auto p-8 rounded-2xl relative">
        <button
          onClick={closeAuth}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          X
        </button>
        <h2 className="text-xl text-center font-bold text-white mb-4">
          Registrati a TV Time
        </h2>
        {/* Form di registrazione */}
        <form
          className="flex flex-col gap-4 text-white"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Nome utente"
            value={username} // Imposta il valore dell'input al nome utente dallo stato
            onChange={(e) => setUsername(e.target.value)} // Aggiorna lo stato del nome utente quando l'input cambia
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email} // Imposta il valore dell'input all'email dallo stato
            onChange={(e) => setEmail(e.target.value)} // Aggiorna lo stato dell'email quando l'input cambia
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password} // Imposta il valore dell'input alla password dallo stato
            onChange={(e) => setPassword(e.target.value)} // Aggiorna lo stato della password quando l'input cambia
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          <input
            type="password"
            placeholder="Conferma password"
            value={confirmPassword} // Imposta il valore dell'input alla conferma password dallo stato
            onChange={(e) => setConfirmPassword(e.target.value)} // Aggiorna lo stato della conferma password quando l'input cambia
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          {/* Rendering condizionale: se la condizione è vera, renderizza l'elemento, altrimenti non renderizzare null */}
          {(localError || error) && (
            <p className="text-red-500 text-sm">{localError || error}</p>
          )}
          {/* Mostra il messaggio di errore se presente */}
          <button
            type="submit"
            className=" font-bold text-black bg-[#ffd400] mr-20 ml-20 rounded-lg hover:bg-yellow-500 cursor-pointer transition-colors p-1"
            disabled={isLoading} // Disabilita il pulsante durante il caricamento
          >
            {isLoading ? "Caricamento..." : "Registrati"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-2 text-center">
          Hai già un account?&nbsp;
          <span
            onClick={openLogin}
            className="text-[#ffd400] font-semibold cursor-pointer hover:underline"
          >
            Accedi
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
