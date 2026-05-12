import React from "react";
import Logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="bg-[#ffd400] text-black flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
      <img
        src={Logo}
        alt="Logo"
        className="w-40 cursor-pointer brightness-125"
      />
      <ul className="hidden xl:flex space-x-6">
        <li>Serie</li>
        <li>Film</li>
        <li>Generi</li>
      </ul>
      <div>
        <div>
          <input type="text" placeholder="Cerca titoli" />
        </div>
        <button>Accedi</button>
        <button>Registrati</button>
      </div>
    </nav>
  );
};

export default Navbar;
