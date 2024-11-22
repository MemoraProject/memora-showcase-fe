"use client";
import { useAiCommunicate } from "hooks/ai.hook";
import { AiRequest, AudioSpeedType } from "interfaces/ai.type";
import {
    MicIcon,
    PauseIcon,
    Settings2Icon,
    XIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { v4 as uuidv4 } from "uuid";
import japanese_boy_2 from "../../../../public/japanese_boy_2.png";
import logo from "../../../../public/logo.png";
import static_voice from "../../../../public/static_voice.png";
import AudioPlayer from "./audio-player";
import { CardMessageInterface } from "./CardMessage";
import MessageHistory from "./MessageHistory";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

export default function AiCommunicate() {
    const { mutate, isLoading, isSuccess, data } = useAiCommunicate();
    const [isTalking, setIsTalking] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [option, setOption] = useState<AudioSpeedType>("NORMAL");
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [payload, setPayload] = useState<AiRequest>({
        uid: uuidv4(),
        audio_speed: "NORMAL",
    });
    const [messageHistory, setMessageHistory] = useState<CardMessageInterface[]>([]);
    const [isHaveHistory, setIsHaveHistory] = useState(false);

    const toggleSettings = () => setIsSetting((prev) => !prev);

    const updateOption = (speedType: AudioSpeedType) => {
        setOption(speedType);
        setPayload((prev) => ({ ...prev, audio_speed: speedType }));
    };

    const handleMicClick = async () => {
        if (isTalking) {
            mediaRecorder?.stop();
            setIsTalking(false);
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        recorder.ondataavailable = (event) => audioChunks.push(event.data);
        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });
            setPayload((prev) => ({ ...prev, file: audioFile }));
            mutate({ ...payload, file: audioFile });
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsTalking(true);
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setIsTalking(false);
        setMediaRecorder(null);
    };

    const renderSpeedOption = (label: string, value: AudioSpeedType) => (
        <label className="flex items-center flex-col gap-1">
            <input
                type="radio"
                value={value}
                checked={option === value}
                onChange={() => updateOption(value)}
                className="hidden"
            />
            <span className="text-white text-sm">{label}</span>
            <span className="w-5 h-5 border-2 rounded-full flex items-center justify-center">
                {option === value && <span className="w-3 h-3 bg-white rounded-full"></span>}
            </span>
        </label>
    );

    useEffect(() => {
        if(data?.user_input != undefined || data?.ai_response != undefined){
            setMessageHistory(prev => [...prev, {
                userMessage: data?.user_input,
                aiMessage: data?.ai_response
            }]);  
            setIsHaveHistory(true)
        }
    }, [mutate, data]);

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#45AFE0] to-[#E7E7E7] pb-12 pt-4">
            {isSuccess && <AudioPlayer fileUrl={data.file_url} />}
            {/* Navbar */}
            <div className="flex justify-center items-center h-[80px]">
                <div className="h-full w-1/3 flex items-center px-2">
                    <img
                        className="w-[71px] h-[71px] animate-fade-in-button"
                        src={logo.src}
                        alt="Logo"
                    />
                </div>
                <div className="h-full w-2/3 flex items-center justify-between px-6">
                    {isSetting ? (
                        <div className="flex gap-6 animate-fade-in">
                            {renderSpeedOption("Chậm", "SLOW")}
                            {renderSpeedOption("Vừa", "NORMAL")}
                            {renderSpeedOption("Nhanh", "FAST")}
                        </div>
                    ) : (
                        <div className="flex gap-4" />
                    )}
                    <button
                        className="rounded-full bg-gray-50 w-[40px] h-[40px] flex items-center justify-center shadow-lg"
                        onClick={toggleSettings}
                    >
                        {isSetting ? (
                            <XIcon className="text-[#525454] animate-fade-in-button" />
                        ) : (
                            <Settings2Icon size={24} className="text-[#525454] animate-fade-in-button" />
                        )}
                    </button>
                </div>
            </div>
            {/* Body */}
            {/* <button onClick={handleHeight}>Click To Handle Height</button> */}
            <div className={`flex-grow flex items-center flex-col ${isHaveHistory ? 'gap-4 justify-start' : 'gap-12 justify-center'}`}>
                <>
                    {isHaveHistory && (
                        <MessageHistory cardMessages={messageHistory} className="h-[60vh] animate-fade-in-slide" />
                    )}
                    <div className={`${isHaveHistory ? 'w-[80px] h-[80px]' : ''} max-w-[400px] max-h-[400px] aspect-square`}>
                        <img
                            className={`w-full h-full`} 
                            src={japanese_boy_2.src}
                            alt="Japanese Boy"
                        />
                    </div>
                    <div className={`w-full flex justify-center items-center ${isHaveHistory ? 'h-[20px] w-[200px]' : 'h-[80px] w-['}`}> 
                        {mediaRecorder ? (
                            <LiveAudioVisualizer
                                mediaRecorder={mediaRecorder}
                                width={isHaveHistory ? 200 : 320}
                                height={isHaveHistory ? 20 : 80} 
                                barWidth={4}
                                gap={1}
                                backgroundColor="transparent"
                                barColor="#FFF"
                                smoothingTimeConstant={0.4}
                            />
                        ) : (
                            <img
                                className="w-1/2 h-full animate-fade-in-button" 
                                src={static_voice.src}
                                alt="Static Voice"
                            />
                        )}
                    </div>
                </>
            </div>
            {/* Footer */}
            <div className={`flex justify-center items-center px-6 ${isHaveHistory ? 'min-h-[100px] -mt-2' : 'min-h-[10px]'}`}>
                {!isTalking && !isLoading ? (
                    <button
                        onClick={handleMicClick}
                        className={`animate-fade-in-button shadow-md bg-[#E3F3FA] rounded-full flex items-center justify-center ${isHaveHistory ? 'h-[40px] w-[40px]' : 'h-[88px] w-[88px]'}`}
                    >
                        <MicIcon className={`text-[#3d3d3d] ${isHaveHistory ? 'h-[20px] w-[20px]' : 'h-[60px] w-[60px]'}`} />
                    </button>
                ) : isLoading ? (
                    <div className={`animate-fade-in-button shadow-md bg-[#E3F3FA] rounded-full flex items-center justify-center ${isHaveHistory ? 'h-[36px] w-[36px]' : 'h-[88px] w-[88px]'}`}>
                        <div className={`${isHaveHistory ? 'w-5 h-5 border-2 border-t-2' : 'w-10 h-10 border-4 border-t-4'} border-[#3d3d3d] border-solid rounded-full animate-spin`}></div>
                    </div>
                ) : (
                    <div className="relative w-full flex justify-center items-center">
                        <button
                            onClick={stopRecording}
                            className={`animate-fade-in-button shadow-md bg-[#E3F3FA] rounded-full flex items-center justify-center ${isHaveHistory ? 'h-[36px] w-[36px]' : 'h-[88px] w-[88px]'}`}
                        >
                            <PauseIcon className={`text-[#3d3d3d] ${isHaveHistory ? 'h-[15px] w-[15px]' : 'h-[60px] w-[60px]'}`} />
                        </button>
                        <button
                            onClick={stopRecording}
                            className={`absolute right-0 animate-fade-in-button shadow-md bg-[#FFD9D9] rounded-full flex items-center justify-center ${isHaveHistory ? 'h-[20px] w-[20px]' : 'h-[44px] w-[44px]'}`}
                        >
                            <XIcon className={`text-[#3d3d3d] ${isHaveHistory ? 'h-[15px] w-[15px]' : 'h-[60px] w-[60px]'}`} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
