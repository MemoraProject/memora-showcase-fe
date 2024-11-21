export type AiRequest = {
    uid: string,
    audio_speed: AudioSpeedType,
    file?: File
}

export type AiResponse = {
    file_url: string,
    ai_reponse: string,
    user_input: string
}
export type AudioSpeedType = "SLOW" | "NORMAL" | "FAST";