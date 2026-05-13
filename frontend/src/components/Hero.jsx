import React from 'react'
import heroBg from '../assets/herobg_placeholder.png'

const Hero = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
        <img src={heroBg} alt="Hero background" 
        className="w-full h-full object-cover"/>

        <div className="">
            <button className="absolute cursor-pointer bottom-20 left-10 bg-black text-white font-bold py-4 px-10 rounded-2xl hover:bg-zinc-800">
                REGISTRATI GRATUITAMENTE
            </button>
        </div>
    </div>
  )
}

export default Hero