import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
    fileUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ fileUrl }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); 
        }
    }, [fileUrl]);

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error("Playback failed:", error);
            });
        }
    };

    return (
        <div>
            <audio ref={audioRef} controls onPlay={handlePlay}>
                <source src={fileUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export default AudioPlayer;