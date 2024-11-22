import { useMutation } from 'react-query';
import { AiCommunicateApi } from 'api/ai';
import { AiRequest, AiResponse } from 'interfaces/ai.type';

export const useAiCommunicate = () => {
    const mutation = useMutation<AiResponse, Error, AiRequest>(
        async (aiRequest: AiRequest) => {
            const formData = new FormData();
            formData.append('uid', aiRequest.uid);
            formData.append('audio_speed', aiRequest.audio_speed);
            if (aiRequest.file) {
                formData.append('file', aiRequest.file);
            }
            return await AiCommunicateApi(formData);
        }
    );

    return mutation;
};
