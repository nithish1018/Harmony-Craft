import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const nav = useNavigate();

    const logout = () => {
        nav('/logout')
    };

    const user = localStorage.getItem("userData")

    return (
        <nav className="bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 h-[70px]">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-white font-bold text-3xl mt-5">Harmony Craft</Link>
                    {user &&
                        <button
                            className=" bg-gray-700 p-2 mt-3 text-white rounded-xl"
                            onClick={logout}
                        > Logout

                        </button>
                    }
                </div>
                <div className={`mt-4 ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col items-center">
                        <li className="my-2">
                            <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;