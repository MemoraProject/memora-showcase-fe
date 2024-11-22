import React, { useEffect, useRef } from 'react';

export default function AudioPlayer({ fileUrl }: { fileUrl: string | null}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (fileUrl) {
            if (audioRef.current) {
                audioRef.current.src = fileUrl;
                audioRef.current.load(); 
                audioRef.current.play().catch((error) => {
                    console.error('Tự động phát thất bại:', error);
                });
            }
        }
    }, [fileUrl]);

    return (
        <div>
            <audio ref={audioRef} style={{ display: 'none' }} />
        </div>
    );
}
