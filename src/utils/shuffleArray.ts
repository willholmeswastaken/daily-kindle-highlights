export const shuffleArray = <T>(array: Array<T>) => {
  // Loop through the array from the end to the beginning
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the current element with the random element
    let firstElem = array[i] as T;
    let secondElem = array[j] as T;
    [firstElem, secondElem] = [secondElem, firstElem];
  }
  return array;
};
