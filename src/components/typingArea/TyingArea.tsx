import { useEffect, useMemo, useRef, useState } from "react";
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
  onTestStarted: boolean;
  onType: (coordinates: coordinates) => void;
  onTestComplete: (isTestComplete: boolean) => void;
  onWordPassed: (numberOfWordPassed: number) => void;
}

const TypingArea = ({
  onType,
  isRefreshClicked,
  lengthRandomList,
  onTestComplete,
  onWordPassed,
}: props) => {
  const [randomListLength, setRandomListLength] = useState(lengthRandomList);
  const [randomWordList, setRandomWordList] = useState(
    getRandomWordList(commonWords, randomListLength)
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [coordinateList, setCoordinateList] = useState<DOMRect[]>([]);
  const [count, setCount] = useState(1);
  const [linesInfo, setLinesInfo] = useState<linesInContainer[]>([]); // State for lines information
  const [initialYValue, setInitialYValue] = useState(0);
  const [wordIndexFromSecondLine, setWordIndexFromSecondLine] = useState(0);
  const [timesRun, setTimeRun] = useState(0);
  const [wordInfo, setWordInfo] = useState<itemsInEachWord[]>([]);
  const [firstWordCoordinates, setFirstWordCoordinates] = useState<coordinates>(
    { x: 0, y: 0 }
  );
  const [timeDifferences, setTimeDifferences] = useState<number[]>([]);
  const [isTestStarted, setTestStarted] = useState(false);

  const pRefs = useRef<HTMLParagraphElement[]>([]);
  const WordRefs = useRef<HTMLDivElement[]>([]);
  const timeStamps = useRef<number[]>([]);
  const inputFocusRef = useRef<HTMLInputElement>(null);

  WordRefs.current = [];
  pRefs.current = [];

  const findAnElementIndexFromSecondLine = () => {
    const indexForThePElement =
      linesInfo[0]?.noOfWords + linesInfo[1]?.noOfWords - 3;
    let wordIndex = 0;
    for (let i = 0; i < indexForThePElement; i++) {
      wordIndex += wordInfo[i]?.noOfItems;
    }

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

    setWordInfo(newWordInfo);
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

    setLinesInfo(newLinesInfo); // Update the lines information
  };

  const calculateLineInfoStateReturner = () => {
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
    return newLinesInfo;
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
    setCount(1);
    calculateInitialCoordinateList();
  };

  const handleCoordinateReset = () => {
    onType({ x: firstWordCoordinates?.x, y: firstWordCoordinates?.y });
  };

  const linesInfoDirect = useMemo(
    () => calculateLineInfoStateReturner(),
    [lengthRandomList]
  );

  const calculateYValueBasedOnLineNumber = (
    updatedCoordinateList: DOMRect[]
  ) => {
    // Initialize variables to keep track of the current line and word
    let yValue = 0;
    let whichLine = 0;
    let currentWord = 0;
    let lastLineIndex = linesInfoDirect.length - 1;
    // Iterate through the linesInfoDirect array to find the current line
    if (whichLine < 3) {
      for (let i = 0; i < linesInfoDirect.length; i++) {
        const wordsInLine = +linesInfoDirect[i].noOfWords;

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
    }

    if (whichLine >= 1) {
      if (whichLine >= lastLineIndex) {
        yValue = updatedCoordinateList[count]?.top;
      } else {
        yValue = initialYValue;
      }
    } else {
      yValue = updatedCoordinateList[count]?.top;
    }
    return [yValue, whichLine];
  };

  const handleCoordinatePassOnKeyPress = (keyDown: string) => {
    const updatedCoordinateList = pRefs.current.map((p) =>
      p.getBoundingClientRect()
    );
    setCoordinateList(updatedCoordinateList);

    let [yValue, whichLine] = calculateYValueBasedOnLineNumber(
      updatedCoordinateList
    );

    if (keyDown === "backspace") {
      if (whichLine <= 1) {
        yValue = updatedCoordinateList[count - 2]?.top;
      }
      onType({
        x: updatedCoordinateList[count - 2]?.left,
        y: yValue,
      });
      setCount(count - 1);
    }
    if (keyDown === "correct") {
      if (
        updatedCoordinateList[count]?.left === undefined &&
        yValue === undefined
      ) {
        onType({
          x: coordinateList[count].left,
          y: coordinateList[count].top,
        });
      } else {
        onType({
          x: updatedCoordinateList[count]?.left,
          y: yValue,
        });
        console.log(
          "X",
          updatedCoordinateList[count]?.left,
          "y",
          yValue,
          "count",
          count
        );
      }

      setCount((prevCount) => prevCount + 1);
    }
  };

  const handleInputFocus = () => {
    if (inputFocusRef.current) {
      inputFocusRef.current.focus();
    }
  };

  const insertLastValueToTimeStamp = () => {
    const current = Date.now();
    timeStamps.current = [...timeStamps.current, current];
  };

  const calculateTimeDifferenceForWords = () => {
    let prevTimeStampValue = timeStamps.current[0];
    let tempList = [];
    let total = 0;
    for (let index = 1; index < timeStamps.current.length; index++) {
      const currentTimeStampValue = timeStamps.current[index];
      const timeDifferenceInSeconds =
        (currentTimeStampValue - prevTimeStampValue) / 1000;
      tempList.push(timeDifferenceInSeconds);
      total += timeDifferenceInSeconds;
      setTimeDifferences((prev) => [...prev, timeDifferenceInSeconds]);
      prevTimeStampValue = currentTimeStampValue;
      console.log("time stamps value ", currentTimeStampValue);
    }
    const wpm = lengthRandomList / (total / 60);
    console.log(tempList);
    console.log("total", total);
    console.log("wpm", wpm);
  };

  useEffect(() => {
    calculateInitialCoordinateList();
    calculateLineInfoState();
    calculateWordInfoState();
  }, []);

  useEffect(() => {
    scrollActiveWordIntoView();
    onWordPassed(activeWordIndex);

    if (activeWordIndex === lengthRandomList) {
      onTestComplete(true);
      tempTestComplete.current = true;
      insertLastValueToTimeStamp();
      calculateTimeDifferenceForWords();

      handleRefresh();
      handleCoordinateReset();
    }

    if (activeLetterIndex === 1 && activeWordIndex === 0) {
      setTestStarted(true);
    }
  }, [activeWordIndex, activeLetterIndex]);

  useEffect(() => {
    findAnElementIndexFromSecondLine();
  }, [linesInfo, wordInfo]);

  useEffect(() => {
    if (timesRun < 7) {
      setInitialYValue(coordinateList[wordIndexFromSecondLine]?.top);
      setFirstWordCoordinates({
        x: coordinateList[0]?.left,
        y: coordinateList[0]?.top,
      });
      setTimeRun((prev) => prev + 1);
    }
  }, [count]);

  useEffect(() => {
    setRandomListLength(lengthRandomList);
    handleRefresh();
    if (count > 1) {
      handleCoordinateReset();
    }
  }, [lengthRandomList]);

  useEffect(() => {
    if (isRefreshClicked) {
      handleRefresh();
    }
  }, [isRefreshClicked]);

  useEffect(() => {
    //when test Starts we Insert a time stamp

    timeStamps.current = [Date.now()];
  }, [isTestStarted]);

  useEffect(() => {
    // now for every actieWordIndex change we insert a timestamp
    const currentTime = Date.now();
    timeStamps.current = [...timeStamps.current, currentTime];
  }, [activeWordIndex]);

  const tempTestComplete = useRef(false);

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
        onKeyPressed={(keyDown) => handleCoordinatePassOnKeyPress(keyDown)}
      />
    </>
  );
};

export default TypingArea;
