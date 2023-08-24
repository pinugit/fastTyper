import { useState } from "react";

const TimeMode = () => {
  const timeModes = [15, 30, 60, 120];
  const [activeTimeMode, setActiveTimeMode] = useState(timeModes[0]);
  return (
    <div className="flex align-middle ">
      {timeModes.map((mode, index) => (
        <button
          onClick={() => setActiveTimeMode(mode)}
          key={index}
          className={`px-2 text-xs bg-primary-dark ${
            mode == activeTimeMode ? "text-gruv-light-yello" : "text-gruv-gray"
          } hover:text-gruv-light-gray `}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};

export default TimeMode;
