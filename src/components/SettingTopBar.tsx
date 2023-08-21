import { useState } from "react";
import TimeMode from "./TimeMode";
import TypingModes from "./TypingModes";
import WordMode from "./WordMode";

const SettingTopBar = () => {
  const [currentMode, setCurrentMode] = useState("time");
  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    console.log(currentMode);
  };
  return (
    <div className="flex bg-primary-dark rounded-xl p-1 align-middle">
      <div className="bg-primary h-6 w-1 m-1 rounded-sm"></div>
      <TypingModes onModeChange={(mode) => handleModeChange(mode)} />
      <div className="bg-primary h-6 w-1 m-1 rounded-sm"></div>
      {currentMode === "time" ? (
        <TimeMode />
      ) : currentMode === "word" ? (
        <WordMode />
      ) : currentMode === "quote" ? (
        <div>quote mode</div>
      ) : currentMode === "zen" ? (
        <div>zen</div>
      ) : null}
    </div>
  );
};

export default SettingTopBar;
