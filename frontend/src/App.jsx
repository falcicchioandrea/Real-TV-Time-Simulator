import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal"; // Controlla la 'r' interna di RegistrerModal.jsx!
import React from "react";
import { Route, Routes } from "react-router-dom";
import Moviepage from "./pages/Moviepage";
import Footer from "./components/Footer";
import SearchPage from "./pages/Searchpage"; // 'Searchpage' con la 'p' minuscola per corrispondere al file fisico!
import UserPage from "./pages/Userpage";

function App() {
  const [IsLoginOpen, setIsLoginOpen] = React.useState(false);
  const [IsRegisterOpen, setIsRegisterOpen] = React.useState(false);

  return (
    <div>
      <Navbar
        onOpenLoginModal={() => setIsLoginOpen(true)}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
      />
      <LoginModal
        isOpen={IsLoginOpen} // Controlla se il modal è aperto o chiuso
        onClose={() => setIsLoginOpen(false)} // Passa la funzione di chiusura del modal al LoginModal
        onSwitchToRegister={() => {
          setIsLoginOpen(false); // Chiude il modal di login
          setIsRegisterOpen(true); // Apre il modal di registrazione
        }}
      />
      <RegisterModal
        isOpen={IsRegisterOpen} // Controlla se il modal è aperto o chiuso
        onClose={() => setIsRegisterOpen(false)} // Passa la funzione di chiusura del modal al RegisterModal
        onSwitchToLogin={() => {
          setIsRegisterOpen(false); // Chiude il modal di registrazione
          setIsLoginOpen(true); // Apre il modal di login
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Homepage onOpenRegisterModal={() => setIsRegisterOpen(true)} />
          }
        />
        <Route path="/movie/:id" element={<Moviepage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/test1" element={<UserPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
