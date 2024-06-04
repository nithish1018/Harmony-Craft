import React from 'react'
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
