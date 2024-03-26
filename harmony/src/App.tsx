import MusicGenerator from './components/MusicGenerator'
import LyricsGenerator from './components/LyricsGenerator'
import React from 'react'
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ToastContainer } from "react-toastify";
import NavBar from './components/NavBar';



function App() {


  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      <ToastContainer />
    </>
  )
}

export default App
