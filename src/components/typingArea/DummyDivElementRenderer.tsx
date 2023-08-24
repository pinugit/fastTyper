interface props {
  randomListLength: number;
}
const DummyDivElementRenderer = ({ randomListLength }: props) => {
  const numberOfDummyBlocks = randomListLength * 3;
  return (
    <>
      {Array.from({ length: numberOfDummyBlocks }).map((_, index) => (
        <div className="flex m-[0.3rem] last-line dummy" key={`dummy-${index}`}>
          <p>&nbsp;</p>
        </div>
      ))}
    </>
  );
};

export default DummyDivElementRenderer;
