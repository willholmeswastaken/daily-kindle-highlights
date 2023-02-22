export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
