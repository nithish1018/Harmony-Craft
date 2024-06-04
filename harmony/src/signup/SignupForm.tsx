import React, { useState } from "react";
import { API_ENDPOINT } from "../config/constants";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import myGIF from "../assets/Gifs/signup.gif"
import { toast } from "react-toastify";

type Inputs = {
    name: string;
    email: string;
    password: string;
};

const SignupForm: React.FC = () => {
    const [loading, setloading] = useState(false)
    const nav = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { name, email, password } = data;
        setloading(true)
        try {
            const response = await fetch('https://harmonybackend-9url.onrender.com/signup', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                toast.error("Sign-up Failed, Try Again", { theme: "dark", autoClose: 1000 });
                throw new Error("Sign-up Failed");
            } else {
                toast.success("Sign-up successful", { theme: "dark", autoClose: 1000 });
            }
            setloading(false)
            console.log("Sign-up successful");
            const data = await response.json();
            localStorage.setItem("authToken", data.auth_token);
            localStorage.setItem("userData", JSON.stringify(data.auth_token.id));
            nav("/generateLyrics");
        } catch (error) {
            console.error("Sign-up failed:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <section className="text-gray-600 body-font bg-gray-700">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                        <img src={myGIF} alt="my-gif" className="w-[700px] h-[500px]" />
                        <p className="leading-relaxed mt-4"></p>
                    </div>
                    <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                            Creat A New Account
                        </h2>
                        <div className="relative mb-4">
                            <label className="leading-7 flex text-sm text-gray-600">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="userName"
                                {...register("name", { required: true })}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                            {errors.name && (
                                <span className="text-red-500">This field is required</span>
                            )}
                        </div>
                        <div className="relative mb-4">
                            <label className="leading-7 flex text-sm text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register("email", { required: true })}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                            {errors.email && (
                                <span className="text-red-500">This field is required</span>
                            )}
                        </div>
                        <div className="relative mb-4">
                            <label className="leading-7 text-sm text-gray-600 flex">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", { required: true })}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                            {errors.password && (
                                <span className="text-red-500">This field is required</span>
                            )}
                        </div>

                        {!loading &&
                            <button
                                type="submit"
                                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-gray mt-4"
                            >
                                Sign up
                            </button>
                        }
                        {loading &&
                            <button
                                type="submit"
                                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-gray mt-4"
                            >
                                Creating Account!
                            </button>
                        }
                    </div>
                </div>
            </section>
        </form>
    );
};

export default SignupForm;
