import React, { useEffect, useRef } from 'react';

export default function AudioPlayer({ fileUrl }: { fileUrl: string }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (fileUrl && videoRef.current) {
            const videoElement = videoRef.current;

            // Reset video state
            videoElement.pause();
            videoElement.src = fileUrl;
            videoElement.muted = true; // Muted initially to comply with autoplay policies
            videoElement.autoplay = true;
            videoElement.playsInline = true;

            // Wait for the video to be ready and play
            videoElement.onloadeddata = () => {
                videoElement
                    .play()
                    .then(() => {
                        console.log('Autoplay succeeded');
                        // Unmute after playback starts
                        videoElement.muted = false;
                    })
                    .catch((error) => {
                        console.error('Autoplay failed:', error);
                        // Show controls as fallback
                        videoElement.controls = true;
                        videoElement.style.display = 'block';
                    });
            };
        }
    }, [fileUrl]);

    return (
        <div>
            <video
                ref={videoRef}
                style={{ width: 1, height: 1, opacity: 0 }}
                controls={false} // Hide controls initially
            />
        </div>
    );
}
