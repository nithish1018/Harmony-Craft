import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({
    children,
}: {
    children: JSX.Element;
}) {
    const { pathname } = useLocation();

    const isAuth = !!localStorage.getItem("authToken");
    if (isAuth) {
        return <>{children}</>;
    } else {
        toast.error("Please Sign-In");
    }
    return <Navigate to="/signin" replace state={{ referrer: pathname }} />;
}
