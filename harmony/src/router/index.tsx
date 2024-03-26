import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Signin from "../signin";
import SignupForm from "../signup/SignupForm";
import LyricsGenerator from "../components/LyricsGenerator";
import MusicGenerator from "../components/MusicGenerator";
import ProtectedRoute from "./ProtectedRoute";
import NavBar from "../components/NavBar";
import MusicList from "../components/MusicList";
import CustomMusicGenerator from "../components/CustomMusicGenerator";
import Logout from "../components/Logout";
import Index from "../components/Index";

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
};

const router = createBrowserRouter([
    {
        path: "/signin",
        element: (
            <Layout>
                <Signin />
            </Layout>
        ),
    },
    {
        path: "/",
        element: (
            <Layout>
                <Index />
            </Layout>
        ),
    },
    {
        path: "/logout",
        element: <Logout />

    },
    {
        path: "/signup",
        element: (
            <Layout>
                <SignupForm />
            </Layout>
        ),
    },
    {
        path: "/generateLyrics",
        element: (
            <Layout>
                <ProtectedRoute>
                    <LyricsGenerator />
                </ProtectedRoute>
            </Layout>
        ),
    },
    {
        path: "/nav",
        element: (
            <Layout>
                <NavBar />
            </Layout>
        ),
    },
    {
        path: "/musiclist",
        element: (
            <Layout>
                <MusicList />
            </Layout>
        ),
    },
    {
        path: "/generateMusic",
        element: (
            <Layout>
                <ProtectedRoute>
                    <MusicGenerator />
                </ProtectedRoute>
            </Layout>
        ),
    },
    {
        path: "/generateCustomMusic",
        element: (
            <Layout>
                <ProtectedRoute>
                    <CustomMusicGenerator />
                </ProtectedRoute>
            </Layout>
        ),
    },
]);

export default router;
