import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({ msg: 'Hello from server' });
}

export async function POST(request: Request) {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
        return new Response('Invalid content type', { status: 400 });
    }

    try {
        // Parse the FormData from the request
        const formData = await request.formData();

        // Extract fields from FormData
        const uid = formData.get('uid') as string; 
        const audioSpeed = formData.get('audio_speed') as string; 
        const file = formData.get('file') as File; 

        const apiFormData = new FormData();
        apiFormData.append('id', uid);
        apiFormData.append('audio_speed', audioSpeed);
        if (file) {
            apiFormData.append('file', file);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/audio/process`, {
            method: 'POST',
            body: apiFormData,
        });

        console.log("response: ", response);


        if (!response.ok) {
            const errorMessage = await response.text();
            return new Response(`Error processing request: ${errorMessage}`, { status: response.status });
        }

        const responseData = await response.json();
        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error in POST request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}