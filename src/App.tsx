import { useState } from "react";
import GenerateRandomWords from "./components/GenerateRandomWords";
import Cursor from "./components/cursor";

interface Coordinates {
  x: number;
  y: number;
}
function App() {
  const [coordinates, setCoordinated] = useState<Coordinates>();
  const handleCoordinates = (coordinates: Coordinates) => {
    setCoordinated(coordinates);
  };
  return (
    <>
      <Cursor
        x={coordinates?.x !== undefined ? coordinates.x : 0}
        y={coordinates?.y !== undefined ? coordinates.y : 0}
      />
      <div className="text-xl mx-[15%]">
        <GenerateRandomWords
          onType={(coordinates) => handleCoordinates(coordinates)}
        />
      </div>
    </>
  );
}

export default App;
