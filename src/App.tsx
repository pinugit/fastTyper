import { useState } from "react";
import GenerateRandomWords from "./components/GenerateRandomWords";
import Cursor from "./components/cursor";
import { BsKeyboard } from "react-icons/bs";
import SettingTopBar from "./components/SettingTopBar";
import RefreshButton from "./components/RefreshButton";

interface Coordinates {
  x: number;
  y: number;
}
function App() {
  const [coordinates, setCoordinated] = useState<Coordinates>();
  const [isRefreshClicked, setRefreshClicked] = useState(false);
  const handleCoordinates = (coordinates: Coordinates) => {
    setCoordinated(coordinates);
  };
  const [paraLength, setParaLength] = useState(15);
  const handleWordModeChange = (mode: number) => {
    setParaLength(mode);
  };
  const handleRefresh = () => {
    setRefreshClicked(true);
    setTimeout(() => {
      setRefreshClicked(false);
    }, 100);
    console.log("button clicked");
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
            <SettingTopBar
              onWordModeChange={(mode) => handleWordModeChange(mode)}
            />
          </div>
          <GenerateRandomWords
            onType={(coordinates) => handleCoordinates(coordinates)}
            lengthRandomList={paraLength}
            isRefreshClicked={isRefreshClicked}
          />
        </div>
        <div className="h-5 flex justify-center align-middle">
          <RefreshButton onRefresh={() => handleRefresh()} />
        </div>
      </div>
    </>
  );
}

export default App;
