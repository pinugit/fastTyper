interface props {
  totalWord: number;
  typedWord: number;
}
const WordCounter = ({ totalWord, typedWord }: props) => {
  return (
    <div className="text-gruv-light-yello m-2 ">
      {typedWord}/{totalWord}
    </div>
  );
};

export default WordCounter;
