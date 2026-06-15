import React, { useState } from "react";
import { Delete, Check } from "lucide-react";

interface VirtualKeyboardProps {
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
  type: "text" | "numeric";
  placeholder?: string;
}

export default function VirtualKeyboard({ value, onChange, onClose, type, placeholder }: VirtualKeyboardProps) {
  const [isShift, setIsShift] = useState(false);

  const handleKeyClick = (key: string) => {
    onChange(value + key);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const azertyLayout = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["W", "X", "C", "V", "B", "N", "'", "-"],
  ];

  const numericLayout = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0"],
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#E0DDD5] border-t-4 border-[#141414] p-2 z-[10003] shadow-[0_-8px_0_0_rgba(0,0,0,0.1)] flex flex-col items-center select-none font-mono">
      <div className="w-full max-w-4xl flex justify-between items-center mb-2 px-1">
        <div className="flex-1 bg-white border-2 border-[#141414] p-3 text-lg font-bold min-h-[56px] flex items-center overflow-x-auto whitespace-nowrap shadow-[2px_2px_0px_#141414] shadow-inner">
          {value || <span className="text-neutral-400 font-normal">{placeholder}</span>}
          <span className="animate-pulse ml-0.5 inline-block w-2.5 h-6 bg-[#141414]"></span>
        </div>
        <button 
          onClick={onClose}
          className="ml-3 bg-green-500 text-white border-2 border-[#141414] shadow-[3px_3px_0px_#141414] p-3 font-bold active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2 uppercase tracking-tight h-[56px]"
        >
           <Check className="w-6 h-6" /> OK
        </button>
      </div>

      <div className="w-full max-w-4xl px-1 pb-1">
        {type === "text" ? (
          <div className="flex flex-col gap-1.5 w-full">
            {azertyLayout.map((row, i) => (
              <div key={i} className="flex justify-center gap-1.5 w-full mx-auto">
                {row.map(key => (
                  <button
                    key={key}
                    onClick={() => handleKeyClick(isShift ? key : key.toLowerCase())}
                    className="flex-1 h-12 sm:h-14 bg-white border-2 border-[#141414] shadow-[2px_2px_0px_#141414] text-lg sm:text-xl font-bold active:translate-y-0.5 active:shadow-[0px_0px_0px_#141414] transition-all flex items-center justify-center min-w-[28px] max-w-[50px] sm:max-w-[60px]"
                  >
                    {isShift ? key : key.toLowerCase()}
                  </button>
                ))}
              </div>
            ))}
            <div className="flex justify-center gap-1.5 mt-0.5 w-full mx-auto">
              <button 
                onClick={() => setIsShift(!isShift)}
                className={`h-14 px-3 border-2 border-[#141414] shadow-[2px_2px_0px_#141414] text-sm sm:text-base font-bold active:translate-y-0.5 active:shadow-[0px_0px_0px_#141414] transition-all flex items-center justify-center flex-[1.5] max-w-[100px] ${isShift ? 'bg-neutral-800 text-white' : 'bg-neutral-300 text-[#141414]'}`}
              >
                MAJ
              </button>
              <button 
                onClick={() => handleKeyClick(" ")}
                className="h-14 bg-white border-2 border-[#141414] shadow-[2px_2px_0px_#141414] text-lg font-bold active:translate-y-0.5 active:shadow-[0px_0px_0px_#141414] transition-all flex items-center justify-center flex-[4]"
              >
                Espace
              </button>
              <button 
                onClick={handleBackspace}
                className="h-14 bg-red-600 text-white border-2 border-[#141414] shadow-[2px_2px_0px_#141414] active:translate-y-0.5 active:shadow-[0px_0px_0px_#141414] transition-all flex items-center justify-center flex-[1.5] max-w-[100px]"
              >
                <Delete className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <div className="flex flex-col gap-2 w-full max-w-[320px]">
              {numericLayout.map((row, i) => (
                <div key={i} className="flex gap-2">
                  {row.map(key => (
                    <button
                      key={key}
                      onClick={() => handleKeyClick(key)}
                      className="flex-1 h-16 sm:h-20 bg-white border-2 border-[#141414] shadow-[3px_3px_0px_#141414] text-2xl sm:text-3xl font-black active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center"
                    >
                      {key}
                    </button>
                  ))}
                  {i === 3 && (
                     <button 
                     onClick={handleBackspace}
                     className="flex-1 h-16 sm:h-20 bg-red-600 text-white border-2 border-[#141414] shadow-[3px_3px_0px_#141414] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center"
                   >
                     <Delete className="w-8 h-8" />
                   </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
