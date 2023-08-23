
const  handleCorrectType = (isCorrect: boolean, count:number, pRefs:) => {
    const updatedCoordinateList = pRefs.current.map((p) =>
      p.getBoundingClientRect()
    );
    setCoordinateList(updatedCoordinateList);

    // Initialize variables to keep track of the current line and word
    let yValue = 0;
    let whichLine = 0;
    let currentWord = 0;
    let lastLineIndex = linesInfo.length - 1;
    // Iterate through the linesInfo array to find the current line
    for (let i = 0; i < linesInfo.length; i++) {
      const wordsInLine = +linesInfo[i].noOfWords;

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

    if (whichLine >= 1) {
      if (whichLine >= lastLineIndex) {
        yValue = updatedCoordinateList[count]?.top;
      } else {
        yValue = initialYValue;
      }
    } else {
      yValue = updatedCoordinateList[count]?.top;
    }

    if (isCorrect) {
      onType({
        x: updatedCoordinateList[count]?.left,
        y: yValue,
      });
      setCount(count + 1);
    }
  };