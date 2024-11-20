
import { AudioLinesIcon, AudioWaveformIcon, MicIcon, UserRoundIcon } from "lucide-react";
import japanese_boy_2 from "../../../public/japanese_boy_2.png";
import logo from "../../../public/logo.svg";
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#45AFE0] to-[#E7E7E7]">
        {/* navbar */}
        <div className="flex justify-center items-center h-[80px]">
          <div className="h-full w-1/3 flex items-center px-2">
            <div className="w-[71px] h-[71px]">
              <img className="w-full h-full" src={logo.src}/>
            </div>
          </div>
          <div className="h-full w-2/3 flex items-center justify-end px-4">
            <div className="rounded-full bg-gray-50 w-[40px] h-[40px] flex items-center justify-center">
              <AudioWaveformIcon size={24} className="text-[#525454]"/>
            </div>
          </div>
        </div>
        {/* body */}
        <div className="flex-grow"> 
          <div className="w-full flex h-full items-center justify-center">
            <div className="w-full flex items-center justify-center flex-col gap-4">
              <div className="flex-grow flex items-center justify-center overflow-hidden w-4/5 h-auto aspect-square"> 
                <img className="h-full w-full" src={japanese_boy_2.src} alt="Japanese Boy" /> 
              </div>

              <div className="w-full flex justify-center items-center">
                <AudioLinesIcon color="#FFF" size={100}/>
              </div>

              <div className="w-full px-4">
                <div className="w-full">
                  <div className="w-full bg-gray-100 flex rounded-md min-h-[60px] items-center gap-2 justify-end px-2">
                    <p className="text-black">Nhật Bản ...</p>
                    <div className="bg-white rounded-full w-[32px] h-[32px] flex items-center justify-center">
                      <UserRoundIcon color="#45afe0" size={20}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* footer */}
        <div className="min-h-[160px] flex justify-center items-center">
          <div className="bg-white w-[88px] h-[88px] rounded-full flex items-center justify-center">
            <MicIcon size={60} className="text-[#525454]"/>
          </div>
        </div>
      </div>
    </main>
  );
}
