import { RefObject, useEffect, useState } from "react";

interface props {
  wordList: string[];
  onActiveLetterIndex: (index: number) => void;
  onActiveWordIndex: (index: number) => void;
  onCorrectType: (isCorrect: boolean) => void;
  inputRef: RefObject<HTMLInputElement>;
  isRefreshClicked: boolean;
  randomListChange: number;
}
const TypeChecker = ({
  wordList,
  onActiveLetterIndex,
  onActiveWordIndex,
  onCorrectType,
  inputRef,
  isRefreshClicked,
  randomListChange,
}: props) => {
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    onActiveLetterIndex(activeLetterIndex);
    onActiveWordIndex(activeWordIndex);
  }, [activeLetterIndex, activeWordIndex]);

  useEffect(() => {
    if (isRefreshClicked) {
      setActiveLetterIndex(0);
      setActiveWordIndex(0);
      setInputValue("");
    }
  }, [isRefreshClicked]);

  useEffect(() => {
    setActiveLetterIndex(0);
    setActiveWordIndex(0);
  }, [randomListChange]);

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      wordList[activeWordIndex].length - 1 === activeLetterIndex &&
      value === " "
    ) {
      setActiveWordIndex((prev) => prev + 1);
      setActiveLetterIndex(0);
      console.log("next word");
      onCorrectType(true);
    } else {
      if (value === wordList[activeWordIndex][activeLetterIndex]) {
        setActiveLetterIndex((prev) => prev + 1);

        setInputValue("");
        console.log("correct");
        onCorrectType(true);
      } else {
        setInputValue("");
        console.log("incorrect");
        onCorrectType(false);
      }
    }
  };
  return (
    <input
      className="absolute top-[-999px]"
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleOnInputChange}
    />
  );
};

export default TypeChecker;
