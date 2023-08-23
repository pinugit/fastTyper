import ParagraphElementRenderer from "./ParagraphElementRenderer";

interface props {
  randomWordList: string[];
  addToWordRefs: (Element: HTMLDivElement) => void;
  addToRefs: (Element: HTMLParagraphElement) => void;
  activeLetterIndex: number;
  activeWordIndex: number;
}
const WordDivElementRederer = ({
  randomWordList,
  addToWordRefs,
  addToRefs,
  activeLetterIndex,
  activeWordIndex,
}: props) => {
  return (
    <>
      {randomWordList.map((word, wordIndex) => (
        <div
          id="wordContainer"
          ref={addToWordRefs}
          className="flex m-[0.3rem] snap-center"
          key={wordIndex}
        >
          {
            <ParagraphElementRenderer
              currentWord={word}
              addToRefs={addToRefs}
              wordIndex={wordIndex}
              activeLetterIndex={activeLetterIndex}
              activeWordIndex={activeWordIndex}
            />
          }
        </div>
      ))}
    </>
  );
};

export default WordDivElementRederer;
