import Hero from "../components/Hero";
import CardList from "../components/CardList";

const Homepage = ({ onOpenRegisterModal }) => {
  return (
    <div>
      <Hero onOpenRegisterModal={onOpenRegisterModal} />
      <CardList />
    </div>
  );
};

export default Homepage;
