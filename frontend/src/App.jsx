import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal"; // Controlla la 'r' interna di RegistrerModal.jsx!
import React from "react";
import { Route, Routes } from "react-router";
import Moviepage from "./pages/Moviepage";
import Footer from "./components/Footer";
import SearchPage from "./pages/Searchpage"; // 'Searchpage' con la 'p' minuscola per corrispondere al file fisico!
import UserPage from "./pages/Userpage";

/* 
---SPA--> Single Page Application-----
Quando l'utente naviga tra i diversi link, il browser non ricarica l'intera pagina, 
ma React Router intercetta l'URL e sostituisce al volo 
solo il componente centrale all'interno del tag <Routes>
*/
function App() {

  return (
    <div>
      <Navbar/>
      <LoginModal/>  {/*overlay(sfondo oscurato) modali(finestra)--> pop-up di
                      login e registrazione attivato da qualunque pagina, controllo centralizzato globalmente da authContext */}
      <RegisterModal/>
      <Routes>  {/* contenitore padre Routes contiene i diversi figli Route;
                  esamina URL corrente del browser e renderizzq componente corrispondente a quel path */}
        <Route path="/" element={<Homepage/>}/>  {/*Rotta statica con parametri */}
   {/* quando viene attivata(URL=path) questa specifica rotta, viene montato e mostrato componente  Homapage()   */}  
        <Route path="/movie/:id" element={<Moviepage />} />  {/*Rotta Dinamica con parametri */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/:username" element={<UserPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
