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
    ];

  return (
    <div>
        <h2>Serie TV di tendenza</h2>

        {data.map((item) => (
            <div>
                <img src={CardImg} alt="" />
                <p>Una serie TV</p>
            </div>
        ))}
    </div>
  )
}

export default CardList