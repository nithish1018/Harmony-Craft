import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import LyricsGenerator from '../LyricsGenerator';
import MusicGenerator from '../MusicGenerator';

const SharedParentComponent = () => {
    const [musicType, setMusicType] = useState([]);
    const { component } = useParams();

    const updateMusicType = (newMusicType) => {
        setMusicType(newMusicType);
    };

    return (
        // <div>
        //     {component === 'lyrics' && (
        //         <LyricsGenerator setMusicType={updateMusicType} />
        //     )}
        //     {component === 'music' && (
        //         <MusicGenerator musicType={musicType} />
        //     )}
        // </div>
    );
};

export default SharedParentComponent;
