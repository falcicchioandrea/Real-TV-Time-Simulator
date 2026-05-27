import React from 'react'
import { useState } from 'react'

const LoginModal = ({isOpen, onClose, onSwitchToRegister}) =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Se isOpen è falso, non viene visualizzata interfaccia Login
    if(!isOpen) return null

    console.log("Email: ", email, "Password: ", password);

    return(
        //Sfondo in sovrimpressione
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 m-4 w-96 h-auto p-8 rounded-2xl relative">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer">
                        X
                </button>          
                <h2 className="text-xl text-center font-bold text-white mb-4">Accedi al tuo account</h2>  
                {/* Form di login */}
                <form className="flex flex-col gap-4 text-white">
                    <input 
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white'
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='p-3 rounded-md bg-zinc-800 outline-none focus:ring-1 focus:ring-white text-white'
                    />
                    <button 
                        type="submit"
                        className=" font-bold text-black bg-[#ffd400] mr-20 ml-20 rounded-lg hover:bg-yellow-500 cursor-pointer transition-colors p-1">
                        Accedi
                    </button>
                </form>

                <p className="text-gray-400 text-sm mt-2 text-center">
                    Non hai un account?&nbsp;  {/* &nbsp; --> è un'entità HTML che rappresenta uno spazio non interruzione (andare a capo), utilizzata per aggiungere spazi tra gli elementi senza permettere l'interruzione di linea.*/}
                    <span 
                        onClick={onSwitchToRegister}
                        className="text-[#ffd400] font-semibold cursor-pointer hover:underline "> 
                        Registrati
                    </span>
                </p>

            </div>
        </div>
    )
        
}
    
export default LoginModal