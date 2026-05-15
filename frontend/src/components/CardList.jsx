import React from 'react'
import CardImg from '../assets/herobg_placeholder.png'

const CardList = () => {
    const data = [
        {
            id: 1,
            title: "Card 1",
            description: "Descrizione 1",
            imageUrl: "placeholder"
        },
        {
            id: 2,
            title: "Card 2",
            description: "Descrizione 2",
            imageUrl: "placeholder"
        },
        {
            id: 3,
            title: "Card 3",
            description: "Descrizione 3",
            imageUrl: "placeholder"
        },
        {
            id: 4,
            title: "Card 4",
            description: "Descrizione 4",
            imageUrl: "placeholder"
        },
        {
            id: 5,
            title: "Card 5",
            description: "Descrizione 5",
            imageUrl: "placeholder"
        },
        {
            id: 5,
            title: "Card 5",
            description: "Descrizione 5",
            imageUrl: "placeholder"
        },

    ];

  return (
    <div className="text-black md:px-4">
        <div>
            <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">Serie TV di tendenza</h2>

            <div className="flex flex-shrink-0 overflow-x-auto scroll-smooth">
                {data.map((item) => (
                    <div className= "flex-shrink-0">
                        <img src={CardImg} alt="" className="h-44 w-full pl-4 pr-4 pt-2 cursor-pointer" />
                        <p className="text-center pt-1">Una serie TV</p>
                    </div>
                ))}
            </div>

            <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">Film di tendenza</h2>

            <div className="flex flex-shrink-0 overflow-x-auto scroll-smooth">
                {data.map((item) => (
                    <div className= "flex-shrink-0">
                        <img src={CardImg} alt="" className="h-44 w-full pl-4 pr-4 pt-2 cursor-pointer" />
                        <p className="text-center pt-1">Un film imperdibile</p>
                    </div>
                ))}
            </div>

            <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">Le Serie TV più viste</h2>

            <div className="flex flex-shrink-0 overflow-x-auto scroll-smooth">
                {data.map((item) => (
                    <div className= "flex-shrink-0">
                        <img src={CardImg} alt="" className="h-44 w-full pl-4 pr-4 pt-2 cursor-pointer" />
                        <p className="text-center pt-1">Una serie TV</p>
                    </div>
                ))}
            </div>

            <h2 className="inline-block pb-5 pt-5 font-medium text-xl cursor-pointer">I Film più visti</h2>

            <div className="flex flex-shrink-0 overflow-x-auto scroll-smooth">
                {data.map((item) => (
                    <div className= "flex-shrink-0">
                        <img src={CardImg} alt="" className="h-44 w-full pl-4 pr-4 pt-2 cursor-pointer" />
                        <p className="text-center pt-1">Un film imperdibile</p>
                    </div>
                ))}
            </div>
        </div>    
    </div>
  )
}

export default CardList