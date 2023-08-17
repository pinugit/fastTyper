import { useState } from "react";

interface props {
  wordList: string[];
  onActiveLetterIndex: (index: number) => void;
  onActiveWordIndex: (index: number) => void;
  onCorrectType: (isCorrect: boolean) => void;
}
const TypeChecker = ({
  wordList,
  onActiveLetterIndex,
  onActiveWordIndex,
  onCorrectType,
}: props) => {
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onActiveLetterIndex(activeLetterIndex);
    onActiveWordIndex(activeWordIndex);
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
  };
  return (
    <input type="text" value={inputValue} onChange={handleOnInputChange} />
  );
};

export default TypeChecker;
