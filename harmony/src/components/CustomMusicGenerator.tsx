import React, { useState } from 'react';
import MusicList from './MusicList';
import { AudioVisualizer } from 'react-audio-visualize';
import { toast } from "react-toastify";
import { API_ENDPOINT } from '../config/constants';

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
    const id = localStorage.getItem("userData");
    try {
        const blob = new Blob([audioData], { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('music', blob);

        console.log('FormData:', formData);

        const response = await fetch(`${API_ENDPOINT}/upload-music/${id}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            toast.success('Music saved successfully!');
        } else {
            throw new Error('Failed to save music.');
        }
    } catch (error) {
        console.error('Error saving music:', error);
        alert('Failed to save music. Please try again.');
    }
}

const CustomMusicGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [audioUrlPart1, setAudioUrlPart1] = useState('');
    const [audioUrlPart2, setAudioUrlPart2] = useState('');
    const [loading, setLoading] = useState(false);
    const [blob, setBlob] = useState<Blob | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleInputChange = (event) => {
        setPrompt(event.target.value);
    };

    const generateMusicParts = async () => {
        try {
            if (!prompt) {
                throw new Error("Prompt is required.");
            }
            setLoading(true);
            const audioBytesPart1 = await query({ inputs: prompt });

            if (!audioBytesPart1) {
                throw new Error("Failed to generate music");
            }

            const musicBlobPart1 = new Blob([audioBytesPart1], { type: 'audio/wav' });
            const audioUrlPart1 = URL.createObjectURL(musicBlobPart1);
            setAudioUrlPart1(audioUrlPart1);
            setBlob(musicBlobPart1);

            const audioBytesPart2 = audioBytesPart1;
            const musicBlobPart2 = new Blob([audioBytesPart2], { type: 'audio/wav' });
            const audioUrlPart2 = URL.createObjectURL(musicBlobPart2);
            setAudioUrlPart2(audioUrlPart2);
            await saveMusicToDatabase(audioBytesPart1);
            await saveMusicToDatabase(audioBytesPart2);
        } catch (error) {
            console.error('Error generating music:', error);
            toast.error("Failed to generate music. Enter a proper prompt.");
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
    };

    const downloadAudioPart2 = () => {
        if (!audioUrlPart2) return;
        const a = document.createElement('a');
        a.href = audioUrlPart2;
        a.download = 'part2_audio.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <>
            <div className="h-screen flex items-center justify-start bg-gray-700 gap-2 pl-10 pr-10">
                <MusicList />
                <div className="ml-10 pl-10">
                    <div className="bg-gray-600 p-8 rounded-lg shadow-md w-[500px] flex flex-col ml-10">
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Music Generator</h2>
                        <div className="flex flex-col">
                            <label htmlFor="prompt" className="text-xl text-gray-300 font-semibold mb-2">Enter Custom Music Type</label>
                            <input
                                type="text"
                                id="prompt"
                                value={prompt}
                                onChange={handleInputChange}
                                className="rounded border-2 p-2 bg-gray-700 text-white"
                                placeholder='Pop, Rock, Classic'
                                required
                            />
                        </div>
                        <button
                            onClick={generateMusicParts}
                            disabled={loading}
                            className="bg-[#001F3F] mt-3 rounded-lg font-medium text-white flex items-center justify-center px-4 py-2 mb-4 hover:bg-gray-500 mr-2"
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

                        {loading && <p className="text-white font-semibold animate-bounce">Loading... Please wait, generating music</p>}
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

export default CustomMusicGenerator;
