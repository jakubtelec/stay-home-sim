import React from "react";
import { THEME } from "../constants";
import "../styles.css";

const defs = [
  { type: "At home", color: THEME.AT_HOME },
  { type: "Mobile", color: THEME.UNAFFECTED },
  { type: "Infected", color: THEME.INFECTED },
  { type: "Highest infected", color: THEME.HIGHEST_INFECTED },
  { type: "Cured", color: THEME.CURED }
];

const Legend = () => {
  return (
    <div className="controls-bar">
      {defs.map(({ type, color }) => (
        <div>{type}</div>
      ))}
    </div>
  );
};

export default Legend;
