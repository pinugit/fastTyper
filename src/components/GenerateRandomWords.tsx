import { useEffect, useRef, useState } from "react";
import commonWords from "./randomWordLIst";
import getRandomWordList from "./getRandomWords";
import TypeChecker from "./TypeChecker";
interface coordinates {
  x: number;
  y: number;
}
interface props {
  onType: (coordinates: coordinates) => void;
}
const GenerateRandomWords = ({ onType }: props) => {
  const [randomListLength, setRandomListLength] = useState(100);
  const [randomWordList, setRandomWordList] = useState(
    getRandomWordList(commonWords, randomListLength)
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [coordinateList, setCoordinateList] = useState<DOMRect[]>([]);
  const [count, setCount] = useState(1);
  const inputFocusRef = useRef<HTMLInputElement>(null);
  // Create an array of refs
  const pRefs = useRef<HTMLParagraphElement[]>([]);
  pRefs.current = [];

  // Add a ref to the array for each p element
  const addToRefs = (element: HTMLParagraphElement) => {
    if (element && !pRefs.current.includes(element)) {
      pRefs.current.push(element);
    }
  };

  // Use the useEffect hook to log the pRefs array when it changes
  useEffect(() => {
    pRefs.current.forEach((p) => {
      const rect = p.getBoundingClientRect();
      if (p === pRefs.current[0]) {
        onType({ x: rect.left, y: rect.top });
      }

      setCoordinateList((prev) => [...prev, rect]);
    });
  }, []);

  const handleCorrectType = (isCorrect: boolean) => {
    const updatedCoordinateList = pRefs.current.map((p) =>
      p.getBoundingClientRect()
    );
    setCoordinateList(updatedCoordinateList);
    if (isCorrect) {
      onType({
        x: updatedCoordinateList[count].left,
        y: updatedCoordinateList[count].top,
      });
      setCount(count + 1);
    }
  };
  const handleInputFocus = () => {
    if (inputFocusRef.current) {
      inputFocusRef.current.focus();
    }
  };

  const getParagraphClassName = (
    activeLetterIndex: number,
    activeWordIndex: number,
    wordIndex: number,
    letterIndex: number
  ) => {
    if (activeLetterIndex === letterIndex && activeWordIndex === wordIndex) {
      return "active";
    } else if (
      activeWordIndex > wordIndex ||
      (activeWordIndex === wordIndex && activeLetterIndex > letterIndex)
    ) {
      return "passed";
    } else {
      return "not-active";
    }
  };

  return (
    <>
      <div
        onClick={handleInputFocus}
        className="flex flex-wrap h-40 min-w-[10%] overflow-auto scroll-auto border-4"
        id="theMainDiv"
      >
        {randomWordList.map((word, wordIndex) => (
          <div className="flex ml-1" key={wordIndex}>
            {word.split("").map((letter, letterIndex) => (
              <p
                ref={addToRefs}
                className={getParagraphClassName(
                  activeLetterIndex,
                  activeWordIndex,
                  wordIndex,
                  letterIndex
                )}
                key={letterIndex}
              >
                {letter}
              </p>
            ))}
          </div>
        ))}
      </div>
      <TypeChecker
        inputRef={inputFocusRef}
        wordList={randomWordList}
        onActiveLetterIndex={(index) => {
          setActiveLetterIndex(index);
        }}
        onActiveWordIndex={(index) => {
          setActiveWordIndex(index);
        }}
        onCorrectType={(isCorrect) => {
          handleCorrectType(isCorrect);
        }}
      />
    </>
  );
};
export default GenerateRandomWords;
