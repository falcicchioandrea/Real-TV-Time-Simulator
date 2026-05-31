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

function App() {

  return (
    <div>
      <Navbar/>
      <LoginModal/>
      <RegisterModal/>
      <Routes>
        <Route
          path="/"
          element={
            <Homepage/>
          }
        />
        <Route path="/movie/:id" element={<Moviepage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/:username" element={<UserPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
