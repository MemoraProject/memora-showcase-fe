"use client"
import { useAiCommunicate } from "hooks/ai.hook";
import { AiRequest, AudioSpeedType } from "interfaces/ai.type";
import { MicIcon, PauseIcon, Settings2Icon, UserRoundIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from 'react';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { v4 as uuidv4 } from 'uuid';
import japanese_boy_2 from "../../../../public/japanese_boy_2.png";
import logo from "../../../../public/logo.png";
import static_voice from "../../../../public/static_voice.png";

declare global {
    interface Window {
      webkitSpeechRecognition: any;
    }
  }

export default function AiCommunicate(){
    const [isTalking, setIsTalking] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [option, setOption] = useState<AudioSpeedType>("NORMAL");
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [transcript, setTranscript] = useState("");
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const recognitionRef = useRef<any>(null);

    const [payload, setPayload] = useState<AiRequest>({
        uid: uuidv4(),
        audio_speed: "NORMAL",
    });
    // Destructure the hook response
    const { fetchCommunicate } = useAiCommunicate();

    console.log("Current Environment: ", process.env.NEXT_PUBLIC_API);

    const handleSettings = () => {
        setIsSetting(prev => !prev);
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const speedType = event.target.value as AudioSpeedType
        
        setOption(speedType);
        setPayload(prev =>({
            ...prev,
            option: speedType
        }))
    };

    const handleMicClick = async () => {
        if (isTalking) {
            // Stop recording
            mediaRecorder?.stop();
            setIsTalking(false);
            stopSpeechRecognition();
        } else {
            // Start recording
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            const audioChunks: Blob[] = [];

            recorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            recorder.onpause = () =>{

            }

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                setAudioBlob(audioBlob);

                const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
                setPayload(prev => ({
                    ...prev,
                    file: audioFile 
                }));
                fetchCommunicate({ ...payload, file: audioFile }); // Call API with updated payload
                // Convert to MP3 and trigger download
                downloadAudio(audioBlob);
            };

            recorder.start();
            setIsTalking(true);
            startSpeechRecognition();
        }
    };

    const handleStopClick = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsTalking(false);
            stopSpeechRecognition();
        }
    };

    const handleCancelClick = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsTalking(false);
            setMediaRecorder(null);
            stopSpeechRecognition();
        }
    };

    const startSpeechRecognition = () => {
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
            const { transcript } = event.results[event.results.length - 1][0];
            setTranscript(transcript);
            console.log("transcript: ", transcript);
        };

        recognitionRef.current.start();
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const downloadAudio = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file.mp3'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); 
    };

    useEffect(() => {
        return () => {
            stopSpeechRecognition();
        };
    }, []);

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#45AFE0] to-[#E7E7E7] pb-12 pt-4">
            {/* navbar */}
            <div className="flex justify-center items-center h-[80px]">
                <div className="h-full w-1/3 flex items-center px-2">
                    <div className="w-[71px] h-[71px] animate-fade-in-button">
                        <img className="w-full h-full" src={logo.src}/>
                    </div>
                </div>
                <div className="h-full w-2/3 flex items-center justify-between px-6">
                    {
                        isSetting ? (
                            <div className="flex justify-center items-center gap-6 flex-row animate-fade-in">
                                <label className="flex items-center flex-col justify-center gap-1 -mt-1">
                                    <input
                                        type="radio"
                                        value="SLOW"
                                        checked={option === "SLOW"}
                                        onChange={handleOptionChange}
                                        className="hidden"
                                    />
                                    <span className="text-white text-sm">Chậm</span>

                                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center`}>
                                        {option === "SLOW" && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                    </span>
                                </label>

                                <label className="flex items-center flex-col justify-center gap-1 -mt-1">
                                    <input
                                        type="radio"
                                        value="NORMAL"
                                        checked={option === "NORMAL"}
                                        onChange={handleOptionChange}
                                        className="hidden"
                                    />
                                    <span className="text-white text-sm">Vừa</span>

                                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center`}>
                                        {option === "NORMAL" && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                    </span>
                                </label>

                                <label className="flex items-center flex-col justify-center gap-1 -mt-1">
                                    <input
                                        type="radio"
                                        value="FAST"
                                        checked={option === "FAST"}
                                        onChange={handleOptionChange}
                                        className="hidden"
                                    />
                                    <span className="text-white text-sm">Nhanh</span>

                                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center`}>
                                        {option === "FAST" && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                    </span>
                                </label>
                            </div> 
                        ) :
                        <div className="flex justify-center items-center gap-4"/>
                    }
                        <button className="rounded-full bg-gray-50 w-[40px] h-[40px] flex items-center justify-center shadow-lg" onClick={handleSettings}>
                            {
                                isSetting ? <XIcon className="text-[#525454] animate-fade-in-button"/> : <Settings2Icon size={24} className="text-[#525454] animate-fade-in-button"/>
                            }
                        </button>
                    </div>
            </div>
            
            {/* body */}
            <div className="flex-grow"> 
            <div className="w-full flex h-full items-center justify-center">
                <div className="w-full flex items-center justify-center flex-col gap-4">
                <div className="max-w-[400px] max-h-[400px] flex-grow flex items-center justify-center overfSLOW-hidden w-4/5 h-auto aspect-square"> 
                    <img className="h-full w-full" src={japanese_boy_2.src} alt="Japanese Boy" /> 
                </div>

                <div className="w-full flex justify-center items-center">
                    {
                        mediaRecorder ? (
                                <LiveAudioVisualizer
                                    mediaRecorder={mediaRecorder}
                                    width={320}
                                    height={80}
                                    barWidth={4} 
                                    gap={1} 
                                    backgroundColor="transparent" 
                                    barColor="#FFF"
                                    smoothingTimeConstant={0.4}
                                />
                        ) : 
                        (
                            <div className="w-1/2 h-[80px] animate-fade-in-button">
                                <img className="w-full h-full" src={static_voice.src}/>
                            </div>
                        )
                    }
                </div>

                <div className="w-full px-4">
                    <div className="w-full">
                    <div className="w-full bg-gray-100 flex rounded-md min-h-[60px] items-center gap-1 -mt-1 justify-end px-2">
                        <p className="text-black">Nhật Bản ...</p>
                        <div className="bg-white rounded-full w-[32px] h-[32px] flex items-center justify-center">
                            <UserRoundIcon color="#45afe0" size={20}/>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            
            {/* Footer with buttons */}
            <div className="min-h-[160px] flex justify-center items-center px-6">
                {!isTalking ? (
                    <button onClick={handleMicClick} className="animate-fade-in-button shadow-md bg-[#E3F3FA] w-[88px] h-[88px] rounded-full flex items-center justify-center">
                        <MicIcon size={60} className="text-[#3d3d3d]" />
                    </button>
                ) : (
                    <div className="relative w-full flex justify-center items-center">
                        <button onClick={handleStopClick} className="animate-fade-in-button shadow-md bg-[#E3F3FA] w-[88px] h-[88px] rounded-full flex items-center justify-center">
                            <PauseIcon size={60} className="text-[#3d3d3d]" />
                        </button>

                        <button onClick={handleCancelClick} className="absolute right-0 animate-fade-in-button shadow-md bg-[#FFD9D9] w-[44px] h-[44px] rounded-full flex items-center justify-center">
                            <XIcon size={20} className="text-[#3d3d3d]" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}