import React from "react";
import { THEME } from "../constants";
import "../styles.css";

const defs = [
  { type: "Unaffected", color: THEME.UNAFFECTED },
  { type: "Unaffected, at home", color: THEME.AT_HOME },
  { type: "Infected", color: THEME.INFECTED },
  { type: "Highest infected", color: THEME.HIGHEST_INFECTED },
  { type: "Cured", color: THEME.CURED },
];

const Legend = () => {
  return (
    <div className="legend-bar">
      {defs.map(({ type, color }) => (
        <div className="legend-item">
          <div
            className="bar"
            style={{
              width: "18px",
              backgroundColor: color,
              marginRight: "8px",
              flexShrink: 0,
            }}
          ></div>
          <div>{type}</div>
        </div>
      ))}
    </div>
  );
};

export default Legend;
