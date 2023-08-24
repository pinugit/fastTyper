import { useRef, useState } from "react";
import Cursor from "./components/cursor";
import { BsKeyboard } from "react-icons/bs";
import SettingTopBar from "./components/TopSettingsBar/SettingTopBar";
import RefreshButton from "./components/RefreshButton";
import TypingArea from "./components/typingArea/TyingArea";
import TestResult from "./components/TestResult/TestResult";
import WordCounter from "./components/WordCounter/WordCounter";

interface Coordinates {
  x: number;
  y: number;
}
function App() {
  const [coordinates, setCoordinated] = useState<Coordinates>();
  const [isRefreshClicked, setRefreshClicked] = useState(false);
  const [paraLength, setParaLength] = useState(15);
  const [isTestComplete, setTestComplete] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const isTyingStarted = useRef(false);

  const handleWordModeChange = (mode: number) => {
    setParaLength(mode);
  };

  const handleCoordinates = (coordinates: Coordinates) => {
    setCoordinated(coordinates);
  };

  const handleRefresh = () => {
    setRefreshClicked(true);
    setTimeout(() => {
      setRefreshClicked(false);
    }, 100);
    console.log("button clicked");
  };

  const handleTestComplete = (isTestComplete: boolean) => {
    if (isTestComplete) {
      setTestComplete(true);
    }
  };

  const handleNumberOfLetterPassed = (activeLetterIndexDirect: number) => {
    if (activeLetterIndexDirect === 1) {
      isTyingStarted.current = true;
    }
  };

  const handleNumberOfWordPassed = (activeWordIndexDirect: number) => {
    setActiveWordIndex(activeWordIndexDirect + 1);
  };

  return (
    <>
      <Cursor
        isTestComplete={isTestComplete}
        x={coordinates?.x !== undefined ? coordinates.x : 0}
        y={coordinates?.y !== undefined ? coordinates.y : 0}
      />
      <div className="text-xl mx-[9%] px-[3%] py-[2%] h-screen">
        <div className="flex ">
          <BsKeyboard className="text-gruv-light-gray text-4xl mr-2" />
          <h1 className="text-3xl text-gruv-light-yello">fastTyper</h1>
        </div>
        {isTestComplete ? (
          <TestResult />
        ) : (
          <>
            <div id="typing-page" className="flex flex-col mt-7">
              <div
                id="container-for-topbar-typingArea-and-refreshButton"
                className={`flex justify-center mb-36 ${
                  isTyingStarted ? "hidden" : " "
                }`}
              >
                <SettingTopBar
                  onWordModeChange={(mode) => handleWordModeChange(mode)}
                />
              </div>
              <div className={`${!isTyingStarted ? "hidden" : "mt-36"}`}>
                <WordCounter
                  typedWord={activeWordIndex}
                  totalWord={paraLength}
                />
              </div>
              <TypingArea
                onTestStarted={isTyingStarted.current}
                lengthRandomList={paraLength}
                isRefreshClicked={isRefreshClicked}
                onType={(coordinates) => handleCoordinates(coordinates)}
                onTestComplete={(isTestComplete) =>
                  handleTestComplete(isTestComplete)
                }
                onLetterPassed={(activeLetterIndexDirect) =>
                  handleNumberOfLetterPassed(activeLetterIndexDirect)
                }
                onWordPassed={(activeWordIndexDirect) => {
                  handleNumberOfWordPassed(activeWordIndexDirect);
                }}
              />
            </div>
            <div
              id="container-for-refreshbutton"
              className={`h-5 flex justify-center align-middle mt-10 ${
                isTyingStarted ? "hidden" : ""
              }`}
            >
              <RefreshButton onRefresh={() => handleRefresh()} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
