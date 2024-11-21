import { AiCommunicateApi } from 'api/ai';
import { AiRequest, AiResponse } from 'interfaces/ai.type';
import { useState } from 'react';

export const useAiCommunicate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AiResponse | null>(null);
    const [isSuccess, setIsSuccess] = useState(false); 

    const fetchCommunicate = async (aiRequest: AiRequest) => {
        setLoading(true);
        setError(null);
        setIsSuccess(false); 
        try {
            const formData = new FormData();
            formData.append('uid', aiRequest.uid);
            formData.append('audio_speed', aiRequest.audio_speed);
            if (aiRequest.file) {
                formData.append('file', aiRequest.file); // Ensure the field name matches what the API expects
            }
 
            console.log("HERE")
            const response = await AiCommunicateApi(formData); // Make sure your API can handle FormData
            console.log("response: ", response);
            setData(response);
            setIsSuccess(true); 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { fetchCommunicate, loading, error, data, isSuccess }; 
};