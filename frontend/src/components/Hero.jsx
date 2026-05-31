import { CheckSquare, Eye, Bell, Search } from "lucide-react";

const Hero = ({ onOpenRegisterModal }) => {
  return (
    <div className="relative w-full h-125 bg-[#0d0d0d]">
      <div>
        <h1 className="font-bold text-white absolute bottom-82 left-15 text-4xl mb-4">
          Unisciti alla più grande community <br />
          di fan di serie TV e film
        </h1>
        <div className="absolute bottom-48 left-20 text-white flex flex-col gap-3">
          <p className="flex items-center gap-2">
            <CheckSquare size={18} /> Tieni traccia di tutto quello che guardi
          </p>
          <p className="flex items-center gap-2">
            <Eye size={18} /> Scopri dove guardarlo
          </p>
          <p className="flex items-center gap-2">
            <Bell size={18} /> Ricevi notifiche quando è disponibile
          </p>
          <p className="flex items-center gap-2">
            <Search size={18} /> Scopri cosa guardare adesso!
          </p>
        </div>
        <button
          className="absolute cursor-pointer bottom-20 left-15 bg-[#ffd400] text-black font-bold py-4 px-10 rounded-2xl hover:bg-[#e6bf00]"
          onClick={onOpenRegisterModal}
        >
          REGISTRATI GRATUITAMENTE
        </button>
      </div>
    </div>
  );
};

export default Hero;
