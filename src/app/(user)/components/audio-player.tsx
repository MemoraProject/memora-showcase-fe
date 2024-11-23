import React, { useEffect, useRef, useState } from 'react';

export default function AudioPlayer({ fileUrl }: { fileUrl: string | null}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (fileUrl && audioRef.current) {
            const audioElement = audioRef.current;
            audioElement.src = fileUrl;
            
            audioElement.play().then(() => {
                setIsMuted(false);
            }).catch((error) => {
                console.error('Tự động phát thất bại:', error);
            });
        }
    }, [fileUrl]);

    return (
        <div>
            <audio ref={audioRef} style={{ display: 'none' }} muted={isMuted} />
        </div>
    );
}
