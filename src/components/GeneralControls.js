import React from "react";
import Timer from "./Timer";
import Legend from "./Legend";
import { getAspectRatio } from "../helpers";
import { THEME } from "../constants";
import { GithubOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "../styles.css";

const GeneralControls = ({
  start,
  resetFields,
  running,
  finished,
  playgroundsContainerSize,
}) => (
  <div className="controls-bar" style={{ width: playgroundsContainerSize }}>
    <div className="stackable-controls">
      <div className="controls">
        <Button
          size={getAspectRatio() <= 1 ? "normal" : "large"}
          className="control-button"
          onClick={start}
          disabled={running}
        >
          Start
        </Button>
        <Button
          size={getAspectRatio() <= 1 ? "normal" : "large"}
          className="control-button"
          onClick={resetFields}
        >
          Reset
        </Button>
        <Timer running={running} finished={finished} />
      </div>
      <Legend />
    </div>
    <GithubOutlined
      onClick={() => {
        const tab = window.open(
          "https://github.com/jakubtelec/stay-home-sim",
          "_blank"
        );
        tab.focus();
      }}
      style={{ color: THEME.GITHUB_LINK }}
      className="git-icon"
    />
  </div>
);

export default GeneralControls;
