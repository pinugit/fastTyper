import React, { useState, useEffect } from "react";

interface CursorProps {
  x: number;
  y: number;
}

const Cursor: React.FC<CursorProps> = ({ x, y }) => {
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
