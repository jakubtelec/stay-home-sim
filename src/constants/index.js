import { red, geekblue, green, purple, grey } from "@ant-design/colors";

export const THEME = {
  INFECTED: red[4],
  HIGHEST_INFECTED: red[2],
  CURED: green[5],
  UNAFFECTED: geekblue[3],
  CHART_BACKGROUND: geekblue[2],
  GITHUB_LINK: grey[2],
  BACKGROUND: geekblue[1],
  AT_HOME: purple[2]
};

export const POPULATION_SIZE = 120;

export const DEFAULT_BOARDS = [
  { percIsolated: 0 },
  { percIsolated: 33 },
  { percIsolated: 66 },
  { percIsolated: 90 }
];

// export const MAX_WIDTH = 700;
