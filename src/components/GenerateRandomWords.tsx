import { useEffect, useRef, useState } from "react";
import commonWords from "./randomWordLIst";
import getRandomWordList from "./getRandomWords";
import TypeChecker from "./TypeChecker";
interface coordinateObject {
  element: HTMLParagraphElement;
  x: number;
  y: number;
}
interface coordinates {
  x: number;
  y: number;
}
interface props {
  onType: (coordinates: coordinates) => void;
}
const GenerateRandomWords = ({ onType }: props) => {
  const [randomListLength, setRandomListLength] = useState(10);
  const [randomWordList, setRandomWordList] = useState(
    getRandomWordList(commonWords, randomListLength)
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [coordinateList, setCoordinateList] = useState<coordinateObject[]>([]);
  const [count, setCount] = useState(1);

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

      setCoordinateList((prev) => [
        ...prev,
        { element: p, x: rect.left, y: rect.top },
      ]);
    });
  }, []);

  const handleCorrectType = (isCorrect: boolean) => {
    if (isCorrect) {
      onType({ x: coordinateList[count].x, y: coordinateList[count].y });
      setCount(count + 1);
    }
  };

  return (
    <>
      <div className="flex flex-wrap h-40 min-w-[10%] overflow-hidden scroll-auto">
        {randomWordList.map((word, wordIndex) => (
          <div className="flex ml-1" key={wordIndex}>
            {word.split("").map((letter, letterIndex) => (
              <p
                ref={addToRefs}
                className={
                  activeLetterIndex === letterIndex &&
                  activeWordIndex === wordIndex
                    ? "active"
                    : "not-active"
                }
                key={letterIndex}
              >
                {letter}
              </p>
            ))}
          </div>
        ))}
      </div>
      <TypeChecker
        wordList={randomWordList}
        onActiveLetterIndex={(index) => {
          setActiveLetterIndex(index);
        }}
        onActiveWordIndex={(index) => {
          setActiveWordIndex(index);
        }}
        onCorrectType={(isCorrect) => handleCorrectType(isCorrect)}
      />
    </>
  );
};

export default GenerateRandomWords;
