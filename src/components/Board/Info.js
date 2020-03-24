import React from "react";
import { THEME, POPULATION_SIZE } from "../../constants";

// import "antd/dist/antd.css";

const infoDefs = [
  {
    styleGetter: ({ homeUnaffected, unaffected }) => {
      const percNonisolated = (1 - homeUnaffected / unaffected) * 100;
      return {
        backgroundImage: `linear-gradient(90deg,${THEME.UNAFFECTED} 0%, ${
          THEME.UNAFFECTED
        } ${percNonisolated - 5}%, ${THEME.AT_HOME} ${percNonisolated + 5}% )`
      };
    },
    valGetter: ({ unaffected }) => unaffected
  },
  {
    styleGetter: () => ({
      background: THEME.HIGHEST_INFECTED
    }),
    valGetter: ({ highestInfected }) => highestInfected
  },
  {
    styleGetter: () => ({ background: THEME.INFECTED }),
    valGetter: ({ infected }) => infected
  },
  {
    styleGetter: () => ({ background: THEME.CURED }),
    valGetter: ({ cured }) => cured
  }
];

const Info = props => {
  const sortedDefs = infoDefs.filter(({ valGetter }) => valGetter(props));
  return (
    <div className="info">
      {infoDefs.map((_, idx) => {
        const { valGetter, styleGetter } = sortedDefs[idx] || {
          valGetter: () => {},
          styleGetter: () => {}
        };
        const value = valGetter(props);
        return (
          <div
            className="bar-container"
            style={{ widht: props.playgroundSize }}
          >
            <div
              className="bar"
              style={{
                ...styleGetter(props),
                width: value
                  ? `${(valGetter(props) / POPULATION_SIZE) *
                      props.playgroundSize *
                      0.8}px`
                  : 0
              }}
            >
              {" "}
            </div>
            {value || ""}
          </div>
        );
      })}
    </div>
  );
};

export default Info;
