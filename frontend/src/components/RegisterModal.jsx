import { useState, useEffect } from "react";
import { useAuth } from "../store/authContext.jsx";

// Modale di registrazione: valida i campi (incluso il confronto password) e crea l'account
const RegisterModal = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setlocalError] = useState(""); // Errori validati lato client (es. password diverse)

  const {
    signup,
    isLoading,
    error,
    clearError,
    isSignupOpen,
    openSignup,
    openLogin,
    closeAuth,
  } = useAuth();

  // Alla chiusura della modale azzera errori e campi del form
  useEffect(() => {
    if (!isSignupOpen) {
      clearError();
      setlocalError("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [isSignupOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Le due password devono coincidere prima di inviare la registrazione
    if (password !== confirmPassword) {
      setlocalError("Le password non corrispondono!");
      return;
    }
    setlocalError(null);

    try {
      await signup(username, email, password);
      closeAuth(); // Chiude la modale dopo una registrazione riuscita
    } catch {
      // Errore già gestito nel context
    }
  };

  // Non renderizza nulla se la modale è chiusa
  if (!isSignupOpen) return null;

  return (
    // Overlay scuro a tutto schermo
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 m-4 w-96 h-auto p-8 rounded-2xl relative">
        <button
          onClick={closeAuth}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          X
        </button>
        <h2 className="text-xl text-center font-bold text-white mb-4">
          Registrati a MovieTrack
        </h2>
        {/* Form di registrazione */}
        <form
          className="flex flex-col gap-4 text-white"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Nome utente"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          <input
            type="password"
            placeholder="Conferma password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white"
          />
          {/* Mostra l'eventuale errore di validazione o del server */}
          {(localError || error) && (
            <p className="text-red-500 text-sm">{localError || error}</p>
          )}
          <button
            type="submit"
            className=" font-bold text-black bg-[#ffd400] mr-20 ml-20 rounded-lg hover:bg-yellow-500 cursor-pointer transition-colors p-1"
            disabled={isLoading}
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
