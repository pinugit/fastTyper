import { useEffect, useRef, useState } from "react";
import commonWords from "./randomWordLIst";
import getRandomWordList from "./getRandomWords";
import TypeChecker from "./TypeChecker";

interface coordinates {
  x: number;
  y: number;
}
interface itemsInEachWord {
  wordIndex: number;
  noOfItems: number;
}
interface linesInContainer {
  lineIndex: number;
  noOfWords: number;
}

interface props {
  onType: (coordinates: coordinates) => void;
}

const GenerateRandomWords = ({ onType }: props) => {
  const [randomListLength, setRandomListLength] = useState(50);
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
  const [initialYValue, setInitialYValue] = useState(0);
  const [wordIndexFromSecondLine, setWordIndexFromSecondLine] = useState(0);
  const [timesRun, setTimeRun] = useState(0);
  const [wordInfo, setWordInfo] = useState<itemsInEachWord[]>([]);

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
  }, []);

  useEffect(() => {
    let noOfPElement = 0;
    const newWordInfo: itemsInEachWord[] = [];

    WordRefs.current.forEach((word, whichWord) => {
      const pElements = word.querySelectorAll("p");
      noOfPElement = pElements.length;
      newWordInfo.push({ wordIndex: whichWord, noOfItems: noOfPElement });
    });

    setWordInfo(newWordInfo);
  }, []);

  useEffect(() => {
    const indexForThePElement =
      linesInfo[0]?.noOfWords + linesInfo[1]?.noOfWords - 3;
    console.log(indexForThePElement);
    let wordIndex = 0;
    for (let i = 0; i < indexForThePElement; i++) {
      wordIndex += wordInfo[i].noOfItems;
    }
    console.log(wordIndex);

    setWordIndexFromSecondLine(wordIndex);
  }, [linesInfo, wordInfo]);

  useEffect(() => {
    if (timesRun < 7) {
      setInitialYValue(coordinateList[wordIndexFromSecondLine]?.top);
      setTimeRun((prev) => prev + 1);
    }
  }, [count]);

  const handleCorrectType = (isCorrect: boolean) => {
    const updatedCoordinateList = pRefs.current.map((p) =>
      p.getBoundingClientRect()
    );
    setCoordinateList(updatedCoordinateList);

    // Initialize variables to keep track of the current line and word
    let yValue = 0;
    let whichLine = 0;
    let currentWord = 0;
    let lastLineIndex = linesInfo.length - 1;
    // Iterate through the linesInfo array to find the current line
    for (let i = 0; i < linesInfo.length; i++) {
      const wordsInLine = +linesInfo[i].noOfWords;

      // Check if the active word index is within the current line
      if (
        activeWordIndex >= currentWord &&
        activeWordIndex < currentWord + wordsInLine
      ) {
        whichLine = i; // Set the current line
        break; // No need to continue searching
      }

      currentWord += wordsInLine; // Move to the next word
    }

    if (whichLine >= 1) {
      if (whichLine === lastLineIndex) {
        yValue = updatedCoordinateList[count]?.top;
      } else {
        yValue = initialYValue;
      }
    } else {
      yValue = updatedCoordinateList[count]?.top;
    }

    console.log("Current Line:", whichLine);
    console.log("initial y value", initialYValue);
    console.log("wordIndexFromSecond LIne ", wordIndexFromSecondLine);

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
