import axios from 'axios';
import { AiResponse } from 'interfaces/ai.type';

export const AiCommunicateApi = async (formData: FormData): Promise<AiResponse> => {
    // const response = await axios.post<AiResponse>(`${process.env.NEXT_PUBLIC_API}/audio/process`, formData, {
    const response = await axios.post(`http://localhost:3000/api/ai`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
    return response.data;
};