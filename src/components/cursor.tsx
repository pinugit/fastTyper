import React, { useState, useEffect } from "react";

interface CursorProps {
  x: number;
  y: number;
}

const Cursor: React.FC<CursorProps> = ({ x, y }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  return (
    <div
      className="absolute bg-gruv-light-yello w-[3px] h-8 transition-all duration-200"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    />
  );
};

export default Cursor;
