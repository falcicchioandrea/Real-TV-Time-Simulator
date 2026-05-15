import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginModal from "./components/LoginModal";
import React from "react";

function App() {
  const [IsLoginOpen, setIsLoginOpen] = React.useState(false);

  return (
    <div>
      <Navbar onOpenLoginModal={() => setIsLoginOpen(true)} /> 
      <Homepage />
      <LoginModal
        isOpen={IsLoginOpen} // Controlla se il modal è aperto o chiuso 
        onClose={()=> setIsLoginOpen(false)} // Passa la funzione di chiusura del modal al LoginModal
      />
    </div>
  );
}

export default App;
