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
