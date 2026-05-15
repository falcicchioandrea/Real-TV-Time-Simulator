import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";

function App() {
  const [IsLoginOpen, setIsLoginOpen] = React.useState(false);

  return (
    <div>
      <Navbar onOpenLoginModal={() => setIsLoginOpen(true)} /> // Passa la funzione di apertura del modal al Navbar
      <Homepage />
      <LoginModal
        isOpen={IsLoginOpen} // Controlla se il modal è aperto o chiuso 
        onClose={()=> setIsLoginOpen(false)} // Passa la funzione di chiusura del modal al LoginModal
      />
    </div>
  );
}

export default App;
