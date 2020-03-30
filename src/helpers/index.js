// import { MAX_WIDTH } from "../constants";

export const computeSizes = () => {
  const aspectRatio = window.innerWidth / window.innerHeight,
    sizeRatio =
      aspectRatio >= 1.8
        ? 0.3
        : aspectRatio >= 1.4
        ? 0.34
        : aspectRatio >= 1
        ? 0.42
        : 0.58,
    examplesNum =
      aspectRatio >= 1.8
        ? 4
        : aspectRatio >= 1.4
        ? 3
        : aspectRatio >= 1
        ? 2
        : 1,
    playgroundSize =
      sizeRatio * Math.min(window.innerWidth, window.innerHeight);
  return { playgroundSize, aspectRatio, examplesNum };
};

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
    [x + 1, y + 1]
  ];
  return neighbours.reduce((acc, [nx, ny]) => {
    const bucket = hashed[String(nx) + "_" + String(ny)];
    if (bucket) return acc.concat(bucket);
    return acc;
  }, []);
};
