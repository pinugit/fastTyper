import { Ref, RefObject, useState } from "react";

interface props {
  wordList: string[];
  onActiveLetterIndex: (index: number) => void;
  onActiveWordIndex: (index: number) => void;
  onCorrectType: (isCorrect: boolean) => void;
  inputRef: RefObject<HTMLInputElement>;
}
const TypeChecker = ({
  wordList,
  onActiveLetterIndex,
  onActiveWordIndex,
  onCorrectType,
  inputRef,
}: props) => {
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
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
        setActiveLetterIndex(activeLetterIndex + 1);
        setInputValue("");
        console.log("correct");
        onCorrectType(true);
      } else {
        setInputValue("");
        console.log("incorrect");
        onCorrectType(false);
      }
    }
    onActiveLetterIndex(activeLetterIndex);
    onActiveWordIndex(activeWordIndex);
  };
  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleOnInputChange}
    />
  );
};

export default TypeChecker;
