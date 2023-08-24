import { useEffect, useState } from "react";
import { FaClock, FaMountain } from "react-icons/fa";
import { VscWholeWord } from "react-icons/vsc";
import { BiSolidQuoteLeft } from "react-icons/bi";

interface props {
  onModeChange: (mode: string) => void;
}
const TypingModes = ({ onModeChange }: props) => {
  const [activeMode, setActiveMode] = useState("time");
  const modes = [
    { name: "time", icon: <FaClock className="bg-primary-dark" /> },
    { name: "word", icon: <VscWholeWord className="bg-primary-dark" /> },
    { name: "quote", icon: <BiSolidQuoteLeft className="bg-primary-dark" /> },
    { name: "zen", icon: <FaMountain className="bg-primary-dark" /> },
  ];

  useEffect(() => {}, []);
  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
    onModeChange(mode);
  };
  return (
    <div className="flex justify-evenly">
      {modes.map((mode, index) => (
        <button
          key={index}
          onClick={() => handleModeChange(mode.name)}
          className={`flex align-middele text-sm bg-primary-dark  p-1 px-2 hover:text-gruv-light-gray ${
            activeMode === mode.name
              ? "text-gruv-light-yello"
              : "text-gruv-gray"
          }`}
        >
          <div className="text-sm p-1 bg-primary-dark">{mode.icon}</div>
          {mode.name}
        </button>
      ))}
    </div>
  );
};

export default TypingModes;
