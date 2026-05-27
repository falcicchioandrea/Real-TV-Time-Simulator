import React from 'react'
import Hero from '../components/Hero'
import CardList from '../components/CardList'
import Footer from '../components/Footer'

const Homepage = ({ onOpenRegisterModal }) => {
  return (
    <div>
        <Hero onOpenRegisterModal={onOpenRegisterModal} />
        <CardList />       
    </div>
  )
}

export default Homepage