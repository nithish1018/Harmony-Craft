import React, { useState, useEffect } from 'react';

const MusicList = () => {
    const [musicFiles, setMusicFiles] = useState([]);
    const userID = localStorage.getItem("userData");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMusicFiles = async () => {
            try {
                const response = await fetch(`https://harmonybackend-9url.onrender.com/music/${userID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch music files');
                }
                const data = await response.json();
                if (response.ok) {
                    setLoading(false);
                }
                console.log('Music files:', data);


                const formattedMusicFiles = data.map(music => ({
                    id: music.id,
                    music: music.music ? `data:audio/wav;base64,${arrayBufferToBase64(music.music.data)}` : null
                }));
                setMusicFiles(formattedMusicFiles);
            } catch (error) {
                console.error('Error fetching music files:', error);
            }
        };

        fetchMusicFiles();
    }, [userID, musicFiles]);

    // Function to convert ArrayBuffer to base64 string
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };


    const handleDownload = (music) => {
        const a = document.createElement('a');
        a.href = music.music;
        a.download = `music_${music.id}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="h-auto w-[400px] border-2 rounded-lg mt-2 shadow-2xl">
            <h2 className='text-white font-medium text-xl p-2 ml-3'>Previously Generated Files</h2>
            {loading &&
                <p className='text-white font-semibold p-2 ml-3 animate-pulse shadow-2xl'>Please Wait, Files are being fetched</p>
            }
            {!loading &&
                <ul className='mt-2 pl-3 pb-2 '>
                    {musicFiles.map((music) => (
                        <li key={music.id} className='mt-2 flex flex-row'>
                            {music.music && (
                                <>
                                    <audio controls src={music.music} className="mr-2" />
                                    <button onClick={() => handleDownload(music)} className="text-white h-[35px] mt-2 mr-2 bg-[#001F3F] hover:bg-gray-500 px-2 py-1 rounded-md">Download</button>
                                </>
                            )}
                        </li>
                    ))}

                </ul>
            }
            {!loading && (!musicFiles.length > 0) &&

                <p className='text-white font-semibold p-2 ml-3 animate-pulse'>No files found , Generate to see them here</p>
            }
        </div>
    );
};

export default MusicList;
