import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


const LyricsGenerator = () => {
    const [songName, setSongName] = useState('');
    const [sentiment, setSentiment] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [loading, setLoading] = useState(false);
    const [musicType, setMusicPattern] = useState([]);

    const nav = useNavigate();


    const copyToClipboard = () => {
        const textarea = document.createElement('textarea');
        textarea.value = lyrics;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        alert('Lyrics copied to clipboard!');
    };

    const musicPage = () => {
        nav("/generateMusic");

    }
    const customMusicPage = () => {
        nav("/generateCustomMusic");

    }

    const generateLyrics = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:5000/generate_lyrics', {
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
            console.log(data.musicType + "ekquhdwjkhjw")
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
        } catch (error) {
            console.error('Error generating lyrics:', error);
        } finally {
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
                <button
                    onClick={generateLyrics}
                    className="bg-[#001F3F] text-white rounded px-4 py-2 mt-4 hover:bg-gray-500"
                >
                    Generate Lyrics
                </button>

                {lyrics &&
                    <button
                        onClick={copyToClipboard}
                        className="bg-[#001F3F] text-white rounded ml-2 px-4 py-2 mt-4 hover:bg-gray-500"
                    >
                        Copy to Clipboard
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
                        className="bg-[#001F3F] text-white rounded  px-4 py-2 mt-4 hover:bg-gray-500"
                    >
                        Get Custom Music Notes
                    </button>
                }
                <div className="mt-8">
                    {lyrics &&
                        <h3 className="text-xl text-white font-semibold mb-2">Generated Lyrics:</h3>}
                    {loading && <p>Loading...</p>}
                    {/* {audioUrl && !loading && <audio controls src={audioUrl} />} */}
                    {!loading && <p className="whitespace-pre-line text-white font-semibold">{lyrics}</p>}

                </div>
            </div>
        </div>
    );
};

export default LyricsGenerator;
