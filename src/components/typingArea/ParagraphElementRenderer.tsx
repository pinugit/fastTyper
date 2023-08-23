interface props {
  currentWord: string;
  addToRefs: (Element: HTMLParagraphElement) => void;
  activeLetterIndex: number;
  activeWordIndex: number;
  wordIndex: number;
}
const ParagraphElementRenderer = ({
  currentWord,
  addToRefs,
  activeLetterIndex,
  activeWordIndex,
  wordIndex,
}: props) => {
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
      {currentWord.split("").map((letter, letterIndex) => (
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
    </>
  );
};

export default ParagraphElementRenderer;
