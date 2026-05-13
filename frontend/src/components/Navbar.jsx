import Logo from "../assets/logo.png";
import { ChevronDown, Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-[#ffd400] text-black flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
      {/*  Gruppo sinitro*/}
      <div className="flex items-center space-x-4 relative">
        <img
          src={Logo}
          alt="Logo"
          className="w-40 cursor-pointer brightness-125"
        />
        <ul className="hidden xl:flex space-x-6">
          <li className="cursor-pointer flex items-center gap-1">
            Serie <ChevronDown size={14} />
          </li>
          <li className="cursor-pointer flex items-center gap-1">
            Film <ChevronDown size={14} />
          </li>
          <li className="cursor-pointer flex items-center gap-1">
            Generi <ChevronDown size={14} />
          </li>
        </ul>
        <Search size={16} />
        <input
          className="border-b border-black bg-transparent outline-none"
          type="text"
          placeholder="Cerca titoli"
        />
      </div>
      {/* Gruppo destro */}
      <div className="flex items-center space-x-4 relative">
        <button>Accedi</button>
        <span className="text-black-50">|</span>
        <button>Registrati</button>
      </div>
    </nav>
  );
};

export default Navbar;
