import { useState } from "react";
import GenerateRandomWords from "./components/GenerateRandomWords";
import Cursor from "./components/cursor";
import { BsKeyboard } from "react-icons/bs";

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
      <div className="text-xl mx-[9%] px-[3%] py-[2%] h-screen">
        <div className="flex ">
          <BsKeyboard className="text-gruv-light-gray text-4xl mr-2" />
          <h1 className="text-3xl text-gruv-light-yello">fastTyper</h1>
        </div>
        <div className="flex flex-col mt-7">
          <div className="flex justify-center mb-36 ">
            <div className="bg-primary-dark h-10 w-60 rounded-lg"></div>
          </div>
          <GenerateRandomWords
            onType={(coordinates) => handleCoordinates(coordinates)}
          />
        </div>
      </div>
    </>
  );
}

export default App;
