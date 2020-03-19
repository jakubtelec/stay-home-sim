import React from "react";
import { THEME, POPULATION_SIZE } from "../../constants";

import "antd/dist/antd.css";

const infoDefs = [
  {
    label: "unaffected",
    colors: [THEME.UNAFFECTED, THEME.AT_HOME],
    getter: ({ infected, cured }) => POPULATION_SIZE - infected - cured
  },
  {
    label: "at home",
    colors: [THEME.AT_HOME],
    getter: ({ atHome }) => atHome
  },
  {
    label: "infected",
    colors: [THEME.INFECTED],
    getter: ({ infected }) => infected
  },
  {
    label: "cured",
    colors: [THEME.CURED],
    getter: ({ cured }) => cured
  }
];

class Info extends React.Component {
  render() {
    return (
      <div className="info">
        {infoDefs.map(({ label, colors, getter }, idx) => (
          <div
            key={`info_${idx}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            {colors.map((color, _idx) => (
              <div
                className="person"
                style={{ backgroundColor: color }}
                key={`legend_${idx}_${_idx}`}
              >
                {" "}
              </div>
            ))}
            {label}: {getter(this.props)}
          </div>
        ))}
      </div>
    );
  }
}

export default Info;
