import { UserRoundIcon, Volume2Icon } from "lucide-react";
import { useState } from "react";
import { renderParseNewlinesToBr } from "utils/parseHelper";
import japanese_boy_2 from "../../../../public/japanese_boy_2.png";

export type CardMessageInterface = {
    userMessage?: string,
    aiMessage?: string,
    fileUrl: string,
    className?: string
}

export default function CardMessage({ userMessage, aiMessage, fileUrl, className } : CardMessageInterface){
    const [audio] = useState(new Audio(fileUrl));

    const playAudio = () => {
        audio.play().catch((error) => {
            console.error("Error playing audio:", error);
        });
    };

    return (
        <>
            <div className="w-full px-4 flex justify-end">
                <div style={{ width: `calc(100% - 40px)` }} className="bg-gray-100 flex rounded-md min-h-[60px] items-center justify-end px-4">
                    <div className="text-black p-2 text-left font-sawarabi">
                        {renderParseNewlinesToBr(userMessage || '')}
                    </div>
                    <div>
                        <div className="bg-white rounded-full w-[32px] h-[32px] flex items-center justify-center">
                            <UserRoundIcon color="#45afe0" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-4">
                <div className="flex flex-row-reverse rounded-md min-h-[60px] items-start gap-2 w-full">
                    <div className={`text-black text-left font-sawarabi w-full relative ${className} pr-6`}>
                        {/* Audio Button  */}
                        <button onClick={playAudio} className="absolute top-0 right-2 border-2 border-white rounded-full w-[28px] h-[28px] flex justify-center items-center shadow-lg">
                            <Volume2Icon className="text-white w-[16px] h-[16px]"/>
                        </button>
                        {
                            renderParseNewlinesToBr(aiMessage || '')
                        }
                    </div>
                    <div className="flex items-start justify-start h-full">
                        <div className="rounded-full w-[32px] h-[32px]">
                            <img 
                                className="w-full h-full"
                                src={japanese_boy_2.src}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}