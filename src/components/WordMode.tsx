import { useState } from "react";

interface props {
  onModeChange: (paraLength: number) => void;
}
const WordMode = ({ onModeChange }: props) => {
  const timeModes = [10, 25, 50, 100];
  const [activeWordMode, setActiveWordMode] = useState(timeModes[0]);
  const handleModeChange = (mode: number) => {
    setActiveWordMode(mode);
    onModeChange(mode);
  };
  return (
    <div className="flex align-middle ">
      {timeModes.map((mode, index) => (
        <button
          onClick={() => handleModeChange(mode)}
          key={index}
          className={`px-2 text-xs bg-primary-dark ${
            mode == activeWordMode ? "text-gruv-light-yello" : "text-gruv-gray"
          } hover:text-gruv-light-gray `}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};

export default WordMode;
