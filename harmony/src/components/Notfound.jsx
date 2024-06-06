import { Link } from "react-router-dom";

export default function Notfound() {

    const isAuth = localStorage.getItem("userData");
    return (
        <div className="flex items-center h-full text-gray-200 justify-center mt-20 pb-20">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl text-blue-600">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-bold text-blue-600 animate-pulse md:text-3xl">
                        Sorry, This page isn't available.
                    </p>

                    {isAuth ? (
                        <Link
                            to="/generateLyrics"
                            className="flex gap-2 items-center justify-center font-semibold text-blue-600"
                        >
                            <span>Back to homepage</span>
                        </Link>
                    ) : (
                        <Link
                            to="/"
                            className="flex gap-2 items-center justify-center font-semibold text-blue-600"
                        >
                            <span className="mt-10">Back to homepage</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}