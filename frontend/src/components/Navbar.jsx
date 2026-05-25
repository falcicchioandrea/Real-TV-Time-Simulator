import Logo from "../assets/logo.png";
import { Search } from "lucide-react";
import { Link } from "react-router";

const Navbar = ({ onOpenLoginModal, onOpenRegisterModal }) => {
  return (
    <>
      <nav className="relative z-50 bg-[#ffd400] text-black flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
        {/*  Gruppo sinistro*/}
        <div className="flex items-center space-x-4 relative">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="w-40 cursor-pointer brightness-125"
            />
          </Link>
          <div className="flex items-center border-b border-black">
            <Search size={16} className="mr-2" />
            <input
              className="bg-transparent outline-none text-black placeholder-black/70 w-full"
              type="text"
              aria-label="Cerca titoli"
              placeholder="Cerca titoli"
            />
          </div>
        </div>
        {/* Gruppo destro */}
        <div className="flex items-center space-x-4 relative">
          <button
            className="cursor-pointer px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
            onClick={() => onOpenLoginModal()}
          >
            Accedi
          </button>
          <span className="text-black/50">|</span>
          <button
            className="cursor-pointer px-3 py-1 rounded-md hover:bg-[black] hover:text-white"
            onClick={() => onOpenRegisterModal()}
          >
            Registrati
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
