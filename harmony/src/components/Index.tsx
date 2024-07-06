import React from 'react'
import hero from '../assets/Gifs/hero.gif'
import { useNavigate } from "react-router-dom";


const Index = () => {
    const nav = useNavigate();
    const handleSignup = () => {
        nav('/signup')
    }
    const handleSignIn = () => {
        nav('/signin');
    }

    return (
        <section className="text-gray-600 body-font bg-gray-700">
            <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
                <img className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded shadow-2xl" alt="hero" src={hero} />
                <div className="text-center lg:w-2/3 w-full">
                    <h1 className="title-font sm:text-5xl text-4xl mb-4 font-medium text-white animate-pulse ">Harmony Craft : Your Personal Music Maestro</h1>
                    <p className="mb-8 leading-relaxed text-white text-xl font-semibold mt-10">Welcome to Harmony Craft, the ultimate destination for crafting original music and lyrics with the power of artificial intelligence. Whether you're a seasoned songwriter looking for inspiration or a newcomer eager to explore your creative talents, Harmony Craft is your go-to platform..</p>
                    <div className="flex justify-center">
                        <button onClick={handleSignup} className="inline-flex text-white bg-[#001F3F] border-0 py-2 px-6 font-semibold focus:outline-none hover:bg-gray-500 h-[50px] w-[200px] text-lg rounded-xl items-center justify-center animate-bounce">Create Account</button>
                        <button onClick={handleSignIn} className="ml-4 inline-flex bg-[#001F3F] border-0 py-2 px-6 pt-3 focus:outline-none font-semibold hover:bg-gray-500 text-lg h-[50px] w-[200px] text-white rounded-xl tems-center justify-center animate-bounce">Sign In</button>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default Index