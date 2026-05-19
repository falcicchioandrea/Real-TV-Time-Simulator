import React from 'react'
import heroBg from '../assets/herobg_placeholder.png'

const Hero = ({onOpenRegisterModal }) => {
  return (
    <div className="relative w-full h-[500px]">
        <img src={heroBg} alt="Hero background" 
        className="w-full h-[480px] object-cover opacity-65"/>

        <div>
            <button 
              className="absolute cursor-pointer bottom-20 left-15 bg-black text-white font-bold py-4 px-10 rounded-2xl hover:bg-zinc-800"
              onClick={onOpenRegisterModal}>
                REGISTRATI GRATUITAMENTE
            </button>
        </div>
    </div>
  )
}

export default Hero