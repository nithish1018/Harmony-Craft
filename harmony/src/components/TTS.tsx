// import React, { useState, useEffect } from "react";

// const TextToSpeech = ({ text }) => {
//     const [isPaused, setIsPaused] = useState(false);
//     const [utterance, setUtterance] = useState(null);
//     const [audioUrl, setAudioUrl] = useState("");

//     useEffect(() => {
//         const synth = window.speechSynthesis;
//         const u = new SpeechSynthesisUtterance(text);
//         u.onend = () => {
//             setIsPaused(false);
//         };
//         setUtterance(u);

//         return () => {
//             synth.cancel();
//         };
//     }, [text]);

//     const handlePlay = () => {
//         const synth = window.speechSynthesis;

//         if (isPaused) {
//             synth.resume();
//         } else {
//             synth.speak(utterance);
//         }

//         setIsPaused(true);
//     };

//     const handlePause = () => {
//         const synth = window.speechSynthesis;

//         synth.pause();

//         setIsPaused(true);
//     };

//     const handleStop = () => {
//         const synth = window.speechSynthesis;

//         synth.cancel();

//         setIsPaused(false);
//     };

//     const handleDownload = () => {
//         const blob = new Blob([utterance.text], { type: "audio/wav" });
//         const url = URL.createObjectURL(blob);
//         setAudioUrl(url);
//     };

//     return (
//         <div>
//             <button onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
//             <button onClick={handlePause}>Pause</button>
//             <button onClick={handleStop}>Stop</button>
//             <button onClick={handleDownload}>Download Audio</button>
//             {audioUrl && <audio src={audioUrl} controls />}
//         </div>
//     );
// };

// export default TextToSpeech;
