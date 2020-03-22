import React from "react";
import { THEME, POPULATION_SIZE } from "../../constants";

import "antd/dist/antd.css";

const infoDefs = [
  {
    styleGetter: ({ infected, cured }) => ({
      backgroundImage: `linear-gradient(90deg,${THEME.UNAFFECTED}, ${THEME.AT_HOME})`
    }),
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

const Info = props => (
  <div className="info">
    {infoDefs.map(({ styleGetter, valGetter }, idx) => {
      const value = valGetter(props);

      return value ? (
        <div
          key={`info_${idx}`}
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: props.playgroundSize
          }}
        >
          <div
            className="bar-container"
            style={{ widht: props.playgroundSize }}
          >
            {value && (
              <div
                className="bar"
                style={{
                  ...styleGetter(props),
                  width: `${(valGetter(props) / POPULATION_SIZE) *
                    props.playgroundSize *
                    0.8}px`
                }}
              >
                {" "}
              </div>
            )}
          </div>
          {value}
        </div>
      ) : (
        <div />
      );
    })}
  </div>
);

export default Info;
