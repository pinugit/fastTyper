import { useState, useEffect } from "react";

interface props {
  x: number;
  y: number;
  isTestComplete: boolean;
}
const Cursor = ({ x, y, isTestComplete }: props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  useEffect(() => {
    if (x === 0 && y === 0) {
      setTimeout(() => {
        setHidden(false);
      }, 200);
    }
  }, []);

  useEffect(() => {
    if (isTestComplete) {
      setHidden(true);
    }
  }, [isTestComplete]);

  return (
    <div
      className={`absolute w-[3px] h-8 transition-all duration-200 ${
        hidden ? "hidden" : "bg-gruv-light-yello "
      }`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    />
  );
};

export default Cursor;
