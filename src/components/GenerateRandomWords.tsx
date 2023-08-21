import { useEffect, useRef, useState } from "react";
import commonWords from "./randomWordLIst";
import getRandomWordList from "./getRandomWords";
import TypeChecker from "./TypeChecker";

interface coordinates {
  x: number;
  y: number;
}

interface linesInContainer {
  lineIndex: number;
  noOfWords: number;
}

interface props {
  onType: (coordinates: coordinates) => void;
}

const GenerateRandomWords = ({ onType }: props) => {
  const [randomListLength, setRandomListLength] = useState(30);
  const [randomWordList, setRandomWordList] = useState(
    getRandomWordList(commonWords, randomListLength)
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [coordinateList, setCoordinateList] = useState<DOMRect[]>([]);
  const [count, setCount] = useState(1);
  const [linesInfo, setLinesInfo] = useState<linesInContainer[]>([]); // State for lines information
  const inputFocusRef = useRef<HTMLInputElement>(null);
  const pRefs = useRef<HTMLParagraphElement[]>([]);
  pRefs.current = [];
  const WordRefs = useRef<HTMLDivElement[]>([]);
  WordRefs.current = [];

  const addToRefs = (element: HTMLParagraphElement) => {
    if (element && !pRefs.current.includes(element)) {
      pRefs.current.push(element);
    }
  };

  const addToWordRefs = (element: HTMLDivElement) => {
    if (element && !WordRefs.current.includes(element)) {
      WordRefs.current.push(element);
    }
  };

  useEffect(() => {
    pRefs.current.forEach((p) => {
      const rect = p.getBoundingClientRect();
      if (p === pRefs.current[0]) {
        onType({ x: rect.left, y: rect.top });
      }

      setCoordinateList((prev) => [...prev, rect]);
    });
  }, []);

  useEffect(() => {
    const activeElement = pRefs.current.find((p) => p.className === "active");
    const scrollElementIntoView = () => {
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "instant",
          block: "center",
          inline: "center",
        });
      }
    };
    requestAnimationFrame(scrollElementIntoView);
  }, [activeWordIndex, activeLetterIndex]);

  useEffect(() => {
    //found the width of the main container
    const mainDiv = document.getElementById("theMainDiv");
    const mainDivWidth = mainDiv ? mainDiv?.clientWidth : 0;
    const wordDivWidth = WordRefs.current.map(
      (wordRef) => wordRef.getBoundingClientRect().width + 9.6
    );

    let currentLineWordLengthTotal = 0;
    let lineIndex = 0;
    let noOfWords = 0;
    const newLinesInfo = []; // Create a new array to update lines information

    wordDivWidth.forEach((currentWordWidth) => {
      if (currentLineWordLengthTotal + currentWordWidth <= mainDivWidth) {
        currentLineWordLengthTotal += currentWordWidth;
        noOfWords += 1;
      } else {
        // Line is completed
        newLinesInfo.push({ lineIndex, noOfWords });
        noOfWords = 1;
        currentLineWordLengthTotal = currentWordWidth;
        lineIndex += 1;
      }
    });

    // Don't forget to add the last line's information
    if (noOfWords > 0) {
      newLinesInfo.push({ lineIndex, noOfWords });
    }

    setLinesInfo(newLinesInfo); // Update the lines information
  }, [randomWordList]);

  const handleCorrectType = (isCorrect: boolean) => {
    const updatedCoordinateList = pRefs.current.map((p) =>
      p.getBoundingClientRect()
    );
    setCoordinateList(updatedCoordinateList);

    let yValue = 0;
    if (linesInfo[0].noOfWords + linesInfo[1].noOfWords - 2 < activeWordIndex) {
      yValue = updatedCoordinateList[linesInfo[1].noOfWords].top;
    } else {
      yValue = updatedCoordinateList[count].top;
    }
    if (isCorrect) {
      onType({
        x: updatedCoordinateList[count]?.left,
        y: yValue,
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
        className="flex flex-wrap h-32 overflow-auto scroll-auto text-2xl snap-y snap-mandatory"
        id="theMainDiv"
      >
        {randomWordList.map((word, wordIndex) => (
          <div
            id="wordContainer"
            ref={addToWordRefs}
            className="flex m-[0.3rem] snap-center"
            key={wordIndex}
          >
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
