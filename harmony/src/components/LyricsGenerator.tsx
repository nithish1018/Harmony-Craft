import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_ENDPOINT } from '../config/constants';



const LyricsGenerator = () => {
    const [songName, setSongName] = useState<string>("");
    const [sentiment, setSentiment] = useState<string>("");
    const [lyrics, setLyrics] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [musicType, setMusicPattern] = useState([]);

    const nav = useNavigate();


    const copyToClipboard = () => {
        const textarea = document.createElement('textarea');
        textarea.value = lyrics;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        toast.success('Lyrics copied to clipboard!');
    };

    const musicPage = () => {
        nav("/generateMusic");

    }
    const customMusicPage = () => {
        nav("/generateCustomMusic");

    }

    const generateLyrics = async () => {
        let error = false;
        try {
            setLoading(true);
            const response = await fetch(`${API_ENDPOINT}/generate_lyrics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    theme: songName,
                    sentiment: sentiment
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            if (data.musicType) {
                localStorage.setItem("musicPatterns", data.musicType)
            }
            if (data && data.lyrics) {
                setLyrics(data.lyrics);
                localStorage.setItem("lyrics", data.lyrics)
                setMusicPattern(data.musicType)
            } else {
                throw new Error('No lyrics generated');
            }
        } catch (err) {
            console.error('Error generating lyrics:', err);
            error = true
            toast.error("Lyrics Generated Failed, Enter prompt properly", { theme: "dark", autoClose: 1000 })

        } finally {
            if (!error)
                toast.success("Lyrics Generated Succesfully!!", { theme: "dark", autoClose: 1000 })
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-700">
            <div className="bg-gray-600 p-8 rounded-lg shadow-md w-[700px]">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Lyrics Generator</h2>
                <div className="space-y-4">
                    <div className="flex flex-col">

                        <label htmlFor="songName" className="text-xl text-gray-300 font-semibold mb-2">Song Name:</label>
                        <input
                            type="text"
                            id="songName"
                            value={songName}
                            onChange={(e) => setSongName(e.target.value)}
                            className="rounded border-2 p-2 bg-gray-300"
                            required
                        />

                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="sentiment" className="text-xl font-semibold text-gray-300 mb-2">Sentiment:</label>
                        <input
                            type="text"
                            id="sentiment"
                            value={sentiment}
                            onChange={(e) => setSentiment(e.target.value)}
                            className="rounded border-2 p-2 bg-gray-300"
                            required
                        />
                    </div>
                </div>
                {!lyrics &&
                    <button
                        onClick={generateLyrics}
                        type='submit'
                        disabled={loading}
                        className="bg-[#001F3F] text-white rounded px-4 py-2 mt-4 hover:bg-gray-500"
                    >
                        Generate Lyrics
                    </button>
                }
                {lyrics &&
                    <button
                        onClick={generateLyrics}
                        type='submit'
                        disabled={loading}
                        className="bg-[#001F3F] text-white rounded px-4 py-2 mt-4 hover:bg-gray-500"
                    >
                        Generate Lyrics Again?
                    </button>
                }
                {lyrics &&
                    <button
                        onClick={musicPage}
                        className="bg-[#001F3F] text-white rounded ml-2 px-4 py-2 mt-4 hover:bg-gray-500"
                    >
                        Get Music For These Lyrics
                    </button>
                }
                {lyrics &&
                    <button
                        onClick={customMusicPage}
                        className="bg-[#001F3F] text-white rounded ml-2  px-4 py-2 mt-4 hover:bg-gray-500"
                    >
                        Get Custom Music Notes
                    </button>
                }
                <div className="mt-8">
                    {lyrics &&
                        <h3 className="text-xl text-white font-semibold mb-2">Generated Lyrics:</h3>}
                   {loading && <p className='text-white animate-pulse text-3xl flex justify-center align-center'>Generating Lyrics...</p>}
                    {!loading &&  <div className="flex p-2 rounded-lg  justify-center align-center bg-slate-200"> <p className="whitespace-pre-line w-full flex p-2 justify-center align-center text-black font-semibold">{lyrics}
                    </p>
                        <div onClick={copyToClipboard} className='cursor-pointer hover:animate-pulse'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                        </svg>
                        </div>
                    </div>}

                </div>
            </div>
        </div >
    );
};

export default LyricsGenerator;
