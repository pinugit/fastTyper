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
  const [randomListLength, setRandomListLength] = useState(100);
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
    //found the width of the main container
    const mainDiv = document.getElementById("theMainDiv");
    const mainDivWidth = mainDiv ? mainDiv?.clientWidth : 0;
    console.log(mainDivWidth);
    const wordDivWidth = WordRefs.current.map(
      (wordRef) => wordRef.getBoundingClientRect().width + 4.8
    );
    console.log(wordDivWidth);

    let currentLineWordLengthTotal = 0;
    let lineIndex = 0;
    let noOfWords = 0;
    wordDivWidth.map((currentWordWidth) => {
      if (currentLineWordLengthTotal < mainDivWidth) {
        currentLineWordLengthTotal += currentWordWidth;
        noOfWords += 1;
        if (currentLineWordLengthTotal > mainDivWidth) {
          //if this condition becomes true means the line is completed
          currentLineWordLengthTotal -= currentWordWidth; // margin for the words;
          setLinesInfo((prev) => [
            ...prev,
            { lineIndex: lineIndex, noOfWords: noOfWords },
          ]);
          console.log(
            "lineLength : " +
              currentLineWordLengthTotal +
              "lineIndex : " +
              lineIndex +
              "index : " +
              noOfWords
          );
          noOfWords = 0;
          currentLineWordLengthTotal = 0;
          lineIndex += 1;
        }
      }
    });
    console.log(linesInfo);
  }, []);

  useEffect(() => {
    const activeElement = pRefs.current.find((p) => p.className === "active");
    const scrollElementIntoView = () => {
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
    };
    requestAnimationFrame(scrollElementIntoView);
  }, [activeWordIndex, activeLetterIndex]);

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
