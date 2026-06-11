import Hero from "../components/Hero"; //importa componenti specifici
import CardList from "../components/CardList";  // Hero--> banner di benvenuto; CardList --> quattro caroselli dei film

const Homepage = () => {  // COMPONENTE--> pagina principale
  return ( 
    <div>
      <Hero/>
      <CardList />
    </div>
  );
};

export default Homepage;  // modulo viene esportato per essere importato nel file
                         // delle rotte dell'App.jsx per essere associato alla rotta "/"
