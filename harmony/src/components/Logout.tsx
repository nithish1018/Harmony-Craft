import React from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {

    useEffect(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
    }, []);

    toast.success("Signed-Out Successfully")
    return <Navigate to="/signin" />;
};

export default Logout;