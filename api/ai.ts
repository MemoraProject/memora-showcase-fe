import axios from 'axios';
import { AiResponse } from 'interfaces/ai.type';

export const AiCommunicateApi = async (formData: FormData): Promise<AiResponse> => {
    const response = await axios.post<AiResponse>(`http://showcase-api.memora.vn/audio/process`, formData, {
    // const response = await axios.post(`http://localhost:4000/audio/process`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
    return response.data;
};