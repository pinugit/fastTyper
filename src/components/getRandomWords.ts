function getRandomWordList(commonWordList: string[], length: number): string[] {
  const randomWordList: string[] = [];

  while (randomWordList.length < length) {
    const randomIndex = Math.floor(Math.random() * commonWordList.length);
    const randomWord = commonWordList[randomIndex];

    if (!randomWordList.includes(randomWord)) {
      randomWordList.push(randomWord + " ");
    }
  }

  return randomWordList;
}

export default getRandomWordList;