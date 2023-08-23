import { useEffect, useRef, useState } from "react";
import commonWords from "../randomWordLIst";
import getRandomWordList from "../getRandomWords";
import TypeChecker from "../TypeChecker";
import WordDivElementRederer from "./WordDivElementRederer";
import DummyDivElementRenderer from "./DummyDivElementRenderer";

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
  lengthRandomList: number;
  isRefreshClicked: boolean;
  onType: (coordinates: coordinates) => void;
}

const TypingArea = ({ onType, isRefreshClicked, lengthRandomList }: props) => {
  const [randomListLength, setRandomListLength] = useState(lengthRandomList);
  const [randomWordList, setRandomWordList] = useState(
    getRandomWordList(commonWords, randomListLength)
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [coordinateList, setCoordinateList] = useState<DOMRect[]>([]);
  const [count, setCount] = useState(1);
  // const [linesInfo, setLinesInfo] = useState<linesInContainer[]>([]); // State for lines information
  const inputFocusRef = useRef<HTMLInputElement>(null);
  const pRefs = useRef<HTMLParagraphElement[]>([]);
  pRefs.current = [];
  const WordRefs = useRef<HTMLDivElement[]>([]);
  WordRefs.current = [];
  const [initialYValue, setInitialYValue] = useState(0);
  const [wordIndexFromSecondLine, setWordIndexFromSecondLine] = useState(0);
  const [timesRun, setTimeRun] = useState(0);
  // const [wordInfo, setWordInfo] = useState<itemsInEachWord[]>([]);

  const linesInfo = useRef<linesInContainer[]>([]);
  const wordInfo = useRef<itemsInEachWord[]>([]);

  useEffect(() => {
    calculateInitialCoordinateList();
  }, []);

  useEffect(() => {
    scrollActiveWordIntoView();
  }, [activeWordIndex, activeLetterIndex]);

  useEffect(() => {
    findAnElementIndexFromSecondLine();
  }, [linesInfo, wordInfo]);

  useEffect(() => {
    if (timesRun < 7) {
      setInitialYValue(coordinateList[wordIndexFromSecondLine]?.top);
      setTimeRun((prev) => prev + 1);
    }
  }, [count]);

  useEffect(() => {
    setRandomListLength(lengthRandomList);
    handleRefresh();
    if (coordinateList.length > 0) {
      handleCoordinateReset();
    }
    calculateLineInfoState();
    calculateWordInfoState();
  }, [lengthRandomList]);

  useEffect(() => {
    if (isRefreshClicked) {
      handleRefresh();
      handleCoordinateReset();
    }
  }, [isRefreshClicked]);

  const findAnElementIndexFromSecondLine = () => {
    const indexForThePElement =
      linesInfo.current[0]?.noOfWords + linesInfo.current[1]?.noOfWords - 3;
    console.log(indexForThePElement);
    let wordIndex = 0;
    for (let i = 0; i < indexForThePElement; i++) {
      wordIndex += wordInfo.current[i]?.noOfItems;
    }
    console.log(wordIndex);

    setWordIndexFromSecondLine(wordIndex);
  };

  const calculateWordInfoState = () => {
    let noOfPElement = 0;
    const newWordInfo: itemsInEachWord[] = [];

    WordRefs.current.forEach((word, whichWord) => {
      const pElements = word.querySelectorAll("p");
      noOfPElement = pElements.length;
      newWordInfo.push({ wordIndex: whichWord, noOfItems: noOfPElement });
    });

    wordInfo.current = newWordInfo;
  };

  const calculateLineInfoState = () => {
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

    linesInfo.current = newLinesInfo; // Update the lines information
  };
  const scrollActiveWordIntoView = () => {
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
  };

  const calculateInitialCoordinateList = () => {
    pRefs.current.forEach((p) => {
      const rect = p.getBoundingClientRect();
      if (p === pRefs.current[0]) {
        onType({ x: rect.left, y: rect.top });
      }

      setCoordinateList((prev) => [...prev, rect]);
    });
  };

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

  const handleRefresh = () => {
    setRandomWordList(getRandomWordList(commonWords, lengthRandomList));
    setActiveLetterIndex(0);
    setActiveWordIndex(0);
    setCount(1);
  };

  const handleCoordinateReset = () => {
    onType({ x: coordinateList[0]?.left, y: coordinateList[0]?.top });
  };

  const calculateYValueBasedOnLineNumber = (
    updatedCoordinateList: DOMRect[]
  ) => {
    // Initialize variables to keep track of the current line and word
    let whichLine = 0;
    let currentWord = 0;
    let wordsInLine = 0;
    // Iterate through the linesInfo array to find the current line
    for (let i = 0; i < linesInfo.current.length; i++) {
      wordsInLine += linesInfo.current[i].noOfWords;

      // Check if the active word index is within the current line
      if (
        activeWordIndex >= currentWord &&
        activeWordIndex < currentWord + wordsInLine - 1
      ) {
        whichLine = i; // Set the current line
        break; // No need to continue searching
      }

      currentWord += wordsInLine; // Move to the next word
    }
    console.log("which line i am on", whichLine);
    console.log("initial y value", initialYValue);
    console.log("active word INdex", activeWordIndex);
    console.log(linesInfo);

    if (whichLine >= 1) {
      console.log("entering if");
      return initialYValue;
    } else {
      return updatedCoordinateList[count]?.top;
    }
  };

  const handleCorrectType = (isCorrect: boolean) => {
    const updatedCoordinateList = pRefs.current.map((p) =>
      p.getBoundingClientRect()
    );
    setCoordinateList(updatedCoordinateList);

    const yValue = calculateYValueBasedOnLineNumber(updatedCoordinateList);
    console.log("the y value ", yValue);

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

  return (
    <>
      <div
        onClick={handleInputFocus}
        className="flex flex-wrap h-32 overflow-auto text-2xl snap-y snap-mandatory"
        id="theMainDiv"
      >
        {
          <WordDivElementRederer
            randomWordList={randomWordList}
            addToRefs={addToRefs}
            addToWordRefs={addToWordRefs}
            activeLetterIndex={activeLetterIndex}
            activeWordIndex={activeWordIndex}
          />
        }
        {<DummyDivElementRenderer randomListLength={randomListLength} />}
      </div>
      <TypeChecker
        inputRef={inputFocusRef}
        wordList={randomWordList}
        isRefreshClicked={isRefreshClicked}
        randomListChange={lengthRandomList}
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

export default TypingArea;
