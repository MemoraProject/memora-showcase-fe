"use client";
import { useAiCommunicate } from "hooks/ai.hook";
import { AiRequest, AudioSpeedType } from "interfaces/ai.type";
import {
    MicIcon,
    PauseIcon,
    Settings2Icon,
    UserRoundIcon,
    XIcon,
} from "lucide-react";
import { useState } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { v4 as uuidv4 } from "uuid";
import japanese_boy_2 from "../../../../public/japanese_boy_2.png";
import logo from "../../../../public/logo.png";
import static_voice from "../../../../public/static_voice.png";
import AudioPlayer from "./audio-player";

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
            <div className="flex-grow flex items-center justify-center flex-col gap-4">
                <img
                    className="max-w-[400px] max-h-[400px] w-4/5 h-auto aspect-square"
                    src={japanese_boy_2.src}
                    alt="Japanese Boy"
                />
                <div className="w-full flex justify-center items-center">
                    {mediaRecorder ? (
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
                    ) : (
                        <img
                            className="w-1/2 h-[80px] animate-fade-in-button"
                            src={static_voice.src}
                            alt="Static Voice"
                        />
                    )}
                </div>
                <div className="w-full px-4">
                    <div className="w-full bg-gray-100 flex rounded-md min-h-[60px] items-center justify-end px-2">
                        <p className="text-black">Nhật Bản ...</p>
                        <div className="bg-white rounded-full w-[32px] h-[32px] flex items-center justify-center">
                            <UserRoundIcon color="#45afe0" size={20} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="min-h-[160px] flex justify-center items-center px-6">
                {!isTalking && !isLoading ? (
                    <button
                        onClick={handleMicClick}
                        className="animate-fade-in-button shadow-md bg-[#E3F3FA] w-[88px] h-[88px] rounded-full flex items-center justify-center"
                    >
                        <MicIcon size={60} className="text-[#3d3d3d]" />
                    </button>
                ) : isLoading ? (
                    <div className="animate-fade-in-button shadow-md bg-[#E3F3FA] w-[88px] h-[88px] rounded-full flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-t-4 border-[#3d3d3d] border-solid rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="relative w-full flex justify-center items-center">
                        <button
                            onClick={stopRecording}
                            className="animate-fade-in-button shadow-md bg-[#E3F3FA] w-[88px] h-[88px] rounded-full flex items-center justify-center"
                        >
                            <PauseIcon size={60} className="text-[#3d3d3d]" />
                        </button>
                        <button
                            onClick={stopRecording}
                            className="absolute right-0 animate-fade-in-button shadow-md bg-[#FFD9D9] w-[44px] h-[44px] rounded-full flex items-center justify-center"
                        >
                            <XIcon size={20} className="text-[#3d3d3d]" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
