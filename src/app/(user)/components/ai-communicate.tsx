"use client";
import { useAiCommunicate } from "hooks/ai.hook";
import { AiRequest, AudioSpeedType } from "interfaces/ai.type";
import { MicIcon, PauseIcon, Settings2Icon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { v4 as uuidv4 } from "uuid";
import japanese_boy_2 from "../../../../public/japanese_boy_2.png";
import logo from "../../../../public/logo.png";
import static_voice from "../../../../public/static_voice.png";
import AudioPlayer from "./audio-player";
import { CardMessageInterface } from "./CardMessage";
import MessageHistory from "./MessageHistory";
import Lottie from "lottie-react";
import loadingAnimation from "../../../../public/Animation - 1732357942308.json";

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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [payload, setPayload] = useState<AiRequest>({
    uid: uuidv4(),
    audio_speed: "NORMAL",
  });
  const [messageHistory, setMessageHistory] = useState<CardMessageInterface[]>(
    [],
  );
  const [isHaveHistory, setIsHaveHistory] = useState(false);
  const [isTranslate, setIsTranslate] = useState(true);

  const toggleSettings = () => setIsSetting((prev) => !prev);

  const updateOption = (speedType: AudioSpeedType) => {
    setOption(speedType);
    setPayload((prev) => ({ ...prev, audio_speed: speedType }));
  };

  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);

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
      const audioFile = new File([audioBlob], "audio.wav", {
        type: "audio/wav",
      });
      stopRecording()
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
    <label className="flex flex-col items-center gap-1">
      <input
        type="radio"
        value={value}
        checked={option === value}
        onChange={() => updateOption(value)}
        className="hidden"
      />
      <span className="text-sm text-white">{label}</span>
      <span className="flex h-5 w-5 items-center justify-center rounded-full border-2">
        {option === value && (
          <span className="h-3 w-3 rounded-full bg-white"></span>
        )}
      </span>
    </label>
  );

  function filterJapaneseCharacters(input: string) {
    const regex =
      /[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{P}\s]/gu;
    return input.replace(regex, "");
  }

  useEffect(() => {
    if (data?.user_input != undefined || data?.ai_response != undefined) {
      setMessageHistory((prev) => [
        ...prev,
        {
            userMessage: data?.user_input,
            aiMessage: isTranslate
                ? data?.ai_response
                : filterJapaneseCharacters(data?.ai_response),
            fileUrl: data?.file_url
        },
      ]);
      setIsHaveHistory(true);
    }
  }, [mutate, data]);

  return (
    <div
      className={`${isHaveHistory ? "" : ""} flex h-screen w-full flex-col bg-gradient-to-b from-[#45AFE0] to-[#E7E7E7] pb-12 pt-4`}
    >
      {isSuccess && <AudioPlayer fileUrl={data.file_url} />}
      {/* Navbar */}
      <div className="flex h-[80px] items-center justify-center">
        <div className="flex h-full w-1/3 items-center px-2">
          <img
            className="animate-fade-in-button h-[71px] w-[71px]"
            src={logo.src}
            alt="Logo"
          />
        </div>
        <div className="flex h-full w-2/3 items-center justify-between px-6">
          {isSetting ? (
            <div className="animate-fade-in flex gap-6">
              {renderSpeedOption("Chậm", "SLOW")}
              {renderSpeedOption("Vừa", "NORMAL")}
              {renderSpeedOption("Nhanh", "FAST")}
            </div>
          ) : (
            <div className="flex gap-4" />
          )}
          <button
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-50 shadow-lg"
            onClick={toggleSettings}
          >
            {isSetting ? (
              <XIcon className="animate-fade-in-button text-[#525454]" />
            ) : (
              <Settings2Icon
                size={24}
                className="animate-fade-in-button text-[#525454]"
              />
            )}
          </button>
        </div>
      </div>
      {/* Body */}
      {/* <button onClick={handleHeight}>Click To Handle Height</button> */}
      <div
        className={`flex flex-grow flex-col items-center ${isHaveHistory ? "justify-start gap-4" : "justify-center gap-12"}`}
      >
        <>
          {isHaveHistory && (
            <>
              <MessageHistory
                cardMessages={messageHistory}
                className="animate-fade-in-slide h-[50vh] shadow-inner"
              />
            </>
          )}
          <div
            className={`${isHaveHistory ? "h-[80px] w-[80px]" : ""} aspect-square max-h-[400px] max-w-[400px]`}
          >
            <img
              className={`h-full w-full`}
              src={japanese_boy_2.src}
              alt="Japanese Boy"
            />
          </div>
          <div
            className={`flex w-full items-center justify-center ${isHaveHistory ? "h-[40px] w-[240px]" : "h-[80px] w-[320px]"}`}
          >
            {mediaRecorder ? (
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                width={isHaveHistory ? 240 : 320}
                height={isHaveHistory ? 20 : 80}
                barWidth={4}
                gap={1}
                backgroundColor="transparent"
                barColor="#FFF"
                smoothingTimeConstant={0.4}
              />
            ) : (
              //   <img
              //     className="animate-fade-in-button h-full w-1/2"
              //     src={static_voice.src}
              //     alt="Static Voice"
              //   />

              <div>
                <Lottie
                  animationData={loadingAnimation}
                  loop={isLoading}
                  className={`animate-fade-in-button h-[100px] w-[100px]`}
                />
              </div>
            )}
          </div>
        </>
      </div>
      {/* Footer */}
      <div
        className={`flex items-center justify-center px-6 ${isHaveHistory ? "-mt-2 min-h-[100px]" : "min-h-[10px]"}`}
      >
        {!isTalking && !isLoading ? (
          <button
            title="Start"
            onClick={handleMicClick}
            className={`animate-fade-in-button flex items-center justify-center rounded-full bg-[#E3F3FA] shadow-md ${isHaveHistory ? "h-[40px] w-[40px]" : "h-[88px] w-[88px]"}`}
          >
            <MicIcon
              className={`text-[#3d3d3d] ${isHaveHistory ? "h-[20px] w-[20px]" : "h-[60px] w-[60px]"}`}
            />
          </button>
        ) : isLoading ? (
          <div
            className={`animate-fade-in-button flex items-center justify-center rounded-full bg-[#E3F3FA] shadow-md ${isHaveHistory ? "h-[36px] w-[36px]" : "h-[88px] w-[88px]"}`}
          >
            <div
              className={`${isHaveHistory ? "h-5 w-5 border-2 border-t-2" : "h-10 w-10 border-4 border-t-4"} animate-spin rounded-full border-solid border-[#3d3d3d]`}
            ></div>
          </div>
        ) : (
          <div className="relative flex w-full items-center justify-center">
            <button
              title="Pause"
              onClick={stopRecording}
              className={`animate-fade-in-button flex items-center justify-center rounded-full bg-[#E3F3FA] shadow-md ${isHaveHistory ? "h-[36px] w-[36px]" : "h-[88px] w-[88px]"}`}
            >
              <PauseIcon
                className={`text-[#3d3d3d] ${isHaveHistory ? "h-[15px] w-[15px]" : "h-[60px] w-[60px]"}`}
              />
            </button>
            <button
              title="Stop"
              onClick={stopRecording}
              className={`animate-fade-in-button absolute right-0 flex items-center justify-center rounded-full bg-[#FFD9D9] shadow-md ${isHaveHistory ? "h-[20px] w-[20px]" : "h-[44px] w-[44px]"}`}
            >
              <XIcon
                className={`text-[#3d3d3d] ${isHaveHistory ? "h-[15px] w-[15px]" : "h-[60px] w-[60px]"}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
