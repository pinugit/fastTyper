import { useEffect, useRef, useState } from "react";
import commonWords from "./randomWordLIst";
import getRandomWordList from "./getRandomWords";
import TypeChecker from "./TypeChecker";
interface coordinateObject {
  element: HTMLParagraphElement;
  x: number;
  y: number;
}
const GenerateRandomWords = () => {
  const [randomListLength, setRandomListLength] = useState(20);
  const [randomWordList, setRandomWordList] = useState(
    getRandomWordList(commonWords, randomListLength)
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [coordinateList, setCoordinateList] = useState<coordinateObject[]>([]);
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
      setCoordinateList((prev) => [
        ...prev,
        { element: p, x: rect.left, y: rect.top },
      ]);
    });
  }, []);
  console.log(coordinateList);

  return (
    <>
      {randomWordList.map((word, wordIndex) => (
        <div className="flex" key={wordIndex}>
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
      <TypeChecker
        wordList={randomWordList}
        onActiveLetterIndex={(index) => {
          setActiveLetterIndex(index);
        }}
        onActiveWordIndex={(index) => {
          setActiveWordIndex(index);
        }}
      />
    </>
  );
};

export default GenerateRandomWords;
