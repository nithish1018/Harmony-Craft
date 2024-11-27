import React, { useState } from 'react';
import MusicList from './MusicList';
import { useNavigate } from "react-router-dom";
import { AudioVisualizer, } from 'react-audio-visualize';
import { useEffect, useRef } from 'react';
import { toast } from "react-toastify";




async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.arrayBuffer();
    return result;
}
async function saveMusicToDatabase(audioData) {
    const id = localStorage.getItem("userData")
    try {
        const blob = new Blob([audioData], { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('music', blob);

        console.log('FormData:', formData); // Logging FormData for debugging

        const response = await fetch(`https://harmonybackend-9url.onrender.com/upload-music/${id}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            toast.success("Music Filed Saved in DataBase", { theme: "dark", autoClose: 1000 })
        } else {
            toast.error("Failed to save music.", { theme: "dark", autoClose: 1000 })
            throw new Error('Failed to save music.');

        }
    } catch (error) {
        console.error('Error saving music:', error);
        alert('Failed to save music. Please try again.');
    }
}



// async function textToSpeech(text) {
//     return new Promise<void>((resolve, reject) => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.voice = window.speechSynthesis.getVoices()[0];
//         utterance.pitch = 1;
//         utterance.rate = 1;
//         utterance.onend = () => {
//             resolve();
//         };
//         window.speechSynthesis.speak(utterance);
//     });
// }

const MusicGenerator = () => {
    const [audioUrlPart1, setAudioUrlPart1] = useState('');
    const [audioUrlPart2, setAudioUrlPart2] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [blob, setBlob] = useState<Blob>();
    const nav = useNavigate();
    useEffect(() => {
        // Cleanup function to stop audio when component unmounts
        return () => {
            setIsPlaying(false);
        };
    }, []);

    const lyrics = localStorage.getItem("lyrics");
    const musicData = localStorage.getItem("musicPatterns");
    const visualizerRef = useRef < HTMLCanvasElement > (null)

    const lines = musicData?.split('\n');
    const musicGenres = lines?.map(line => {
        const match = line.match(/^\d+\.\s(.+)$/);
        return match ? match[1] : null;
    });
    const genresString = musicGenres?.filter(genre => genre !== null).join(', ');

    const generateMusicParts = async () => {
        try {
            setLoading(true);

            // Perform text-to-speech synthesis
            // const speechBlob = await textToSpeech(lyrics);

            // toast.success("Text Read out Completed", { theme: "dark", autoClose: 1000 })


            // Generate music for part 1
            const audioBytesPart1 = await query({ "inputs": genresString });
            const musicBlobPart1 = new Blob([audioBytesPart1], { type: 'audio/wav' });
            const audioUrlPart1 = URL.createObjectURL(musicBlobPart1);
            setAudioUrlPart1(audioUrlPart1);
            setBlob(musicBlobPart1)

            // Generate music for part 2 (same as part 1)
            const audioBytesPart2 = audioBytesPart1;
            const musicBlobPart2 = new Blob([audioBytesPart2], { type: 'audio/wav' });
            const audioUrlPart2 = URL.createObjectURL(musicBlobPart2);
            setAudioUrlPart2(audioUrlPart2);
            toast.success("Music Files Generated Successfully", { theme: "dark", autoClose: 1000 })
            await saveMusicToDatabase(audioBytesPart1);
            await saveMusicToDatabase(audioBytesPart2);


        } catch (error) {
            console.error('Error generating music:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadAudioPart1 = () => {
        if (!audioUrlPart1) return;
        const a = document.createElement('a');
        a.href = audioUrlPart1;
        a.download = 'part1_audio.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Successfully Downloaded!")
    };

    const downloadAudioPart2 = () => {
        if (!audioUrlPart2) return;
        const a = document.createElement('a');
        a.href = audioUrlPart2;
        a.download = 'part2_audio.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Successfully Downloaded!")

    };
    const customMusicPage = () => {
        nav("/generateCustomMusic");

    }

    return (
        <>

            <div className="min-h-screen flex items-center justify-start bg-gray-700 gap-2 pl-10 pr-10">
                <MusicList />
                <div className="ml-10 pl-10">
                    <div className="bg-gray-600 p-8 rounded-lg shadow-md w-[500px] flex flex-col ml-10">
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Music Generator</h2>
                        <button
                            onClick={generateMusicParts}
                            disabled={loading}
                            className="bg-[#001F3F] rounded-lg font-medium text-white flex items-center justify-center px-4 py-2 mb-4 hover:bg-gray-500 mr-2"
                        >
                            Auto Generate Music Parts
                        </button>
                        <button
                            onClick={customMusicPage}
                            disabled={loading}
                            className="bg-[#001F3F] rounded-lg font-medium text-white flex items-center justify-center px-4 py-2 mb-4 hover:bg-gray-500 mr-2"
                        >
                            Generate Custom Music Parts
                        </button>

                        {audioUrlPart1 &&
                            <button
                                onClick={downloadAudioPart1}
                                disabled={!audioUrlPart1}
                                className="bg-[#001F3F] rounded-lg font-medium text-white px-4 py-2 mb-4 hover:bg-gray-500 mr-2"
                            >
                                Download Part 1
                            </button>
                        }

                        {audioUrlPart2 &&
                            <button
                                onClick={downloadAudioPart2}
                                disabled={!audioUrlPart2}
                                className="bg-[#001F3F] rounded-lg font-medium text-white px-4 py-2 mb-4 hover:bg-gray-500"
                            >
                                Download Part 2
                            </button>
                        }

                        {loading && <p className="text-white font-semibold animate-bounce">Please wait, Music notes are being generated with given lyrics as context</p>}
                        {(audioUrlPart1 || audioUrlPart2) && !loading && (
                            <div className="flex justify-center">
                                {audioUrlPart1 && <audio controls className="mx-2" onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)} src={audioUrlPart1} />}
                                {audioUrlPart2 && <audio controls className="mx-2" onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)} src={audioUrlPart2} />}
                            </div>
                        )}
                        {isPlaying && blob && <AudioVisualizer blob={blob}
                            width={500}
                            height={75}
                            barWidth={1}
                            gap={0}
                            barColor={'#f76565'} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MusicGenerator;
