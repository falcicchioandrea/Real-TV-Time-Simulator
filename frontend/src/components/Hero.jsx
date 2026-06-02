import { CheckSquare, Eye, Bell, Search } from "lucide-react";
import { useAuth } from "../store/authContext";
import Sfondo from "../assets/sfondo-hero.png"; 

const Hero = () => {
  const {openSignup, user} = useAuth();
  
  return ( //md = medium devices (tablet e desktop), px = padding orizzontale, py = padding verticale, gap = spazio tra elementi in un flex o grid
    <div className="w-full px-6 py-10 md:px-9 md:h-450]"
              style={{
          backgroundImage: `url(${Sfondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
      <div className="text-white">
        {!user ? (
          <h1 className="font-bold text-3xl md:text-4xl mb-6">
          Unisciti alla più grande community di Film!
          </h1>
        ):(
          <h1 className="font-bold text-3xl md:text-4xl mb-6">
          Benvenuto, {user.username}!
          </h1>
        )}
        <div className=" flex flex-col gap-3 mb-8 text-sm md:text-base">
          <p className="flex items-center gap-2">
            <CheckSquare size={20}/> Tieni traccia di tutto quello che guardi
          </p>
          <p className="flex items-center gap-2">
            <Eye size={20}/> Scopri dove guardarlo
          </p>
          <p className="flex items-center gap-2">
            <Bell size={20} /> Ricevi notifiche quando è disponibile
          </p>
          <p className="flex items-center gap-2">
            <Search size={20}/> Scopri cosa guardare adesso!
          </p>
        </div>

        {/* Bottone: larghezza 100% su mobile (w-full), auto su PC (md:w-auto) */}
        {!user && (
          <button
            className="cursor-pointer bg-[#ffd400] text-black font-bold py-3 px-6 rounded-2xl hover:bg-[#e6bf00]"
            onClick={openSignup}
          >
            REGISTRATI GRATUITAMENTE
          </button>
        )}
      </div>
    </div>
  );
};

export default Hero;