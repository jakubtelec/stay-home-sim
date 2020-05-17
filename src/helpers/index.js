import { DEFAULT_PERCENTAGES } from "../constants";

export const getAspectRatio = () => window.innerWidth / window.innerHeight;

export const computeSizes = () => {
  const aspectRatio = getAspectRatio(),
    sizeRatio =
      aspectRatio >= 1.8
        ? 0.25
        : aspectRatio >= 1.4
        ? 0.3
        : aspectRatio >= 1
        ? 0.45
        : aspectRatio >= 0.6
        ? 0.4
        : 0.45,
    examplesNum =
      aspectRatio >= 1.8
        ? 4
        : aspectRatio >= 1.4
        ? 3
        : aspectRatio >= 1
        ? 2
        : 1,
    playgroundSize =
      sizeRatio * Math.min(window.innerWidth, window.innerHeight),
    playgroundsContainerSize =
      (playgroundSize + 48) * examplesNum + (examplesNum - 1) * 24;
  // (single playground size * 2 * card padding) + (examples number - 1) * right padding of playground card)
  return { playgroundSize, aspectRatio, examplesNum, playgroundsContainerSize };
};

export const getDefaultBoards = () =>
  DEFAULT_PERCENTAGES.map((perc) => ({
    percIsolated: perc,
    finished: false,
  }));

export const hashify = (objects, bucketSize) => {
  const buckets = {};
  for (const object of objects) {
    const { x, y } = object;
    const hash =
      String(Math.floor(x / bucketSize)) +
      "_" +
      String(Math.floor(y / bucketSize));
    if (!buckets[hash]) buckets[hash] = [];
    buckets[hash].push(object);
  }
  return buckets;
};

export const getNeighbours = (obj, hashed, bucketSize) => {
  const x = Math.floor(obj.x / bucketSize);
  const y = Math.floor(obj.y / bucketSize);
  const neighbours = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y + 1],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];
  return neighbours.reduce((acc, [nx, ny]) => {
    const bucket = hashed[String(nx) + "_" + String(ny)];
    if (bucket) return acc.concat(bucket);
    return acc;
  }, []);
};
