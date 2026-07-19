export const millisecondsToSeconds = (time: number) => {
  return time / 1000;
};

export const computeThroughputPerSecond = (options: { duration: number; gain: number }) => {
  const { duration, gain } = options;

  return gain / duration;
};
