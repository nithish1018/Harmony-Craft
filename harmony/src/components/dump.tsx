import React, { useState } from 'react';

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

async function textToSpeech(text) {
    return new Promise<void>((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = window.speechSynthesis.getVoices()[0];
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.onend = () => {
            resolve();
        };
        window.speechSynthesis.speak(utterance);
    });
}

const MusicGenerator = () => {
    const [audioUrl, setAudioUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const lyrics = localStorage.getItem("lyrics");
    const musicData = localStorage.getItem("musicPatterns");

    const lines = musicData.split('\n');
    const musicGenres = lines.map(line => {
        const match = line.match(/^\d+\.\s(.+)$/);
        return match ? match[1] : null;
    });
    const genresString = musicGenres.filter(genre => genre !== null).join(', ');

    const generateMusic = async () => {
        try {
            setLoading(true);

            // Perform text-to-speech synthesis
            const speechBlob = await textToSpeech(lyrics);


            // Generate music
            const audioBytes = await query({ "inputs": genresString });
            const musicBlob = new Blob([audioBytes], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(musicBlob);
            setAudioUrl(audioUrl);
        } catch (error) {
            console.error('Error generating music:', error);
        } finally {
            setLoading(false);
        }
    };





    const downloadAudio = () => {
        if (!audioUrl) return;
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'downloaded_audio.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">
                <h2 className="text-3xl font-semibold text-center mb-8 text-red-500">Music Generator</h2>
                <button
                    onClick={generateMusic}
                    disabled={loading}
                    className="bg-blue-500 text-white rounded px-4 py-2 mb-4 hover:bg-blue-700 mr-2"
                >
                    Generate Music
                </button>

                {audioUrl &&
                    <button
                        onClick={downloadAudio}
                        disabled={!audioUrl}
                        className="bg-green-500 text-white rounded px-4 py-2 mb-4 hover:bg-green-700"
                    >
                        Download Audio
                    </button>
                }

                {loading && <p className="text-gray-600">Loading... Please wait, generating music</p>}
                {audioUrl && !loading && <audio controls className="mt-4" src={audioUrl} />}
            </div>
        </div>
    );
};

export default MusicGenerator;
