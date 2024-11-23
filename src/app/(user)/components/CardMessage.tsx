import { UserRoundIcon, Volume2Icon } from "lucide-react";
import { useState } from "react";
import { renderParseNewlinesToBr } from "utils/parseHelper";
import japanese_boy_2 from "../../../../public/japanese_boy_2.png";

export type CardMessageInterface = {
  userMessage?: string;
  aiMessage?: string;
  fileUrl: string;
  className?: string;
};

export default function CardMessage({
  userMessage,
  aiMessage,
  fileUrl,
  className,
}: CardMessageInterface) {
  const [audio] = useState(new Audio(fileUrl));

  const playAudio = () => {
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  return (
    <>
      <div className="flex w-full justify-end px-4">
        <div
          style={{ width: `calc(100% - 40px)` }}
          className="flex min-h-[60px] items-center justify-end rounded-md bg-gray-100 px-4"
        >
          <div className="p-2 text-left font-sawarabi text-black">
            {renderParseNewlinesToBr(userMessage || "")}
          </div>
          <div>
            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white">
              <UserRoundIcon color="#45afe0" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4">
        <div className="flex min-h-[60px] w-full flex-row items-start gap-2 rounded-md">
          <div className="flex h-full items-start justify-start">
            <div className="h-[32px] w-[32px] rounded-full">
              <img
                title="Japanese Boy"
                className="h-full w-full"
                src={japanese_boy_2.src}
              />
            </div>
          </div>
          <div
            className={`w-full text-left font-sawarabi text-black ${className}`}
          >
            {/* Audio Button  */}
            {renderParseNewlinesToBr(aiMessage || "")}
          </div>
          <div className="flex items-center justify-center">
            <button
              title="Play Audio"
              onClick={playAudio}
              className="flex h-[28px] w-[28px] items-center justify-center rounded-full border-2 border-white shadow-lg"
            >
              <Volume2Icon className="h-[16px] w-[16px] text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
