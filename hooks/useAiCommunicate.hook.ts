import { useEffect, useRef, useState } from 'react';
import { AiRequest, AudioSpeedType } from 'interfaces/ai.type';
import { v4 as uuidv4 } from 'uuid';

export const useAiCommunicateState = () => {
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

    const handleSettings = () => {
        setIsSetting(prev => !prev);
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const speedType = event.target.value as AudioSpeedType;
        setOption(speedType);
        setPayload(prev => ({
            ...prev,
            option: speedType
        }));
    };

    const handleMicClick = async () => {
        if (isTalking) {
            mediaRecorder?.stop();
            setIsTalking(false);
            stopSpeechRecognition();
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            const audioChunks: Blob[] = [];

            recorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                setAudioBlob(audioBlob);

                const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
                console.log("audioFile: ", audioFile)
                setPayload(prev => ({
                    ...prev,
                    file: audioFile
                }));
                // Call API with updated payload (fetchCommunicate should be passed from the component)
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
        };

        recognitionRef.current.start();
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    useEffect(() => {
        return () => {
            stopSpeechRecognition();
        };
    }, []);

    return {
        isTalking,
        isSetting,
        option,
        mediaRecorder,
        transcript,
        audioBlob,
        payload,
        setIsTalking,
        handleSettings,
        handleOptionChange,
        handleMicClick,
        handleStopClick,
        handleCancelClick,
        setPayload,
    };
};