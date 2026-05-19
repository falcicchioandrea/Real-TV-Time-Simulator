import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegistrerModal";
import React from "react";

function App() {
  const [IsLoginOpen, setIsLoginOpen] = React.useState(false);
  const [IsRegisterOpen, setIsRegisterOpen] = React.useState(false);
  
  return (
    <div>
      <Navbar 
        onOpenLoginModal={() => setIsLoginOpen(true)} 
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
      /> 
      <Homepage 
        onOpenRegisterModal={() => setIsRegisterOpen(true)} />
      <LoginModal
        isOpen={IsLoginOpen} // Controlla se il modal è aperto o chiuso 
        onClose={()=> setIsLoginOpen(false)} // Passa la funzione di chiusura del modal al LoginModal
        onSwitchToRegister={() => {
          setIsLoginOpen(false); // Chiude il modal di login
          setIsRegisterOpen(true); // Apre il modal di registrazione
        }}
      />
      <RegisterModal
        isOpen={IsRegisterOpen} // Controlla se il modal è aperto o chiuso 
        onClose={()=> setIsRegisterOpen(false)} // Passa la funzione di chiusura del modal al RegisterModal
        onSwitchToLogin={() => {
          setIsRegisterOpen(false); // Chiude il modal di registrazione
          setIsLoginOpen(true); // Apre il modal di login
        }}
      />

    </div>
  );
}

export default App;
