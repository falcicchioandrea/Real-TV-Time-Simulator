import React from 'react'
import heroBg from '../assets/herobg_placeholder.png'

const Hero = ({onOpenRegisterModal }) => {
  return (
    <div className="relative w-full h-[500px]">
        <img src={heroBg} alt="Hero background" 
        className="w-full h-[480px] object-cover opacity-65"/>

        <div>
          <h1 className="font-bold text-white absolute bottom-82 left-15 text-4xl">
            Unisciti alla più grande community <br/>di fan di serie TV e film
          </h1>
          <p className="absolute bottom-48 left-20 text-white">
            &#9745; Tieni traccia di tutto quello che guardi <br/>
            &#128065; Scopri dove guardarlo <br/>
            &#128276; Ricevi notifiche quando è disponibile <br/>
            &#128269; Scopri cosa guardare adesso!
          </p>
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