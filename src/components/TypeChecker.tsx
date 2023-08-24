import React, { RefObject, useEffect, useState } from "react";

interface props {
  wordList: string[];
  inputRef: RefObject<HTMLInputElement>;
  isRefreshClicked: boolean;
  randomListChange: number;
  onActiveLetterIndex: (index: number) => void;
  onActiveWordIndex: (index: number) => void;
  onKeyPressed: (keyDown: string) => void;
}
const TypeChecker = ({
  wordList,
  inputRef,
  isRefreshClicked,
  randomListChange,
  onActiveLetterIndex,
  onActiveWordIndex,
  onKeyPressed,
}: props) => {
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const passCorrectKeyPress = () => {
    onKeyPressed("correct");
  };

  const passIncorrectKeyPress = () => {
    onKeyPressed("incorrect");
  };

  const passBackspacePress = () => {
    onKeyPressed("backspace");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = event.key;
    console.log(value);

    if (value != "Backspace") {
      if (
        wordList[activeWordIndex].length - 1 === activeLetterIndex &&
        value === " "
      ) {
        setActiveWordIndex((prev) => prev + 1);
        setActiveLetterIndex(0);
        console.log("next word");
        passCorrectKeyPress();
      } else {
        if (value === wordList[activeWordIndex][activeLetterIndex]) {
          setActiveLetterIndex((prev) => prev + 1);
          setInputValue("");
          console.log("correct");
          passCorrectKeyPress();
        } else {
          setInputValue("");
          console.log("incorrect");
          passIncorrectKeyPress();
        }
      }
    } else {
      if (activeLetterIndex > 0 || activeWordIndex > 0) {
        if (activeLetterIndex > 0) {
          setActiveLetterIndex((prev) => prev - 1);
          setInputValue("");
          passBackspacePress();
          console.log("backspace clicked within word");
        } else if (activeWordIndex > 0) {
          setActiveWordIndex((prev) => prev - 1);
          setActiveLetterIndex(wordList[activeWordIndex - 1].length - 1);
          setInputValue("");
          passBackspacePress();
          console.log("backspace clicked at word start");
        }
      } else {
        //on first word
        null;
      }
    }
  };

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

  return (
    <input
      className="absolute top-[-999px]"
      ref={inputRef}
      type="text"
      defaultValue={inputValue}
      onKeyDown={handleKeyPress}
    />
  );
};

export default TypeChecker;
