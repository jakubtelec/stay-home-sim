import React from "react";
import Timer from "./Timer.js";
import { THEME } from "../constants";
import { GithubOutlined } from "@ant-design/icons";
import { Button } from "antd";

const GeneralControls = ({
  start,
  resetFields,
  running,
  finished,
  playgroundSize
}) => {
  return (
    <div className="controls-bar">
      <div className="controls">
        <Button
          size={"large"}
          className="control-button"
          style={{ width: playgroundSize / 3 }}
          onClick={start}
          disabled={running}
        >
          Start
        </Button>
        <Button
          size={"large"}
          className="control-button"
          style={{ width: playgroundSize / 3 }}
          onClick={resetFields}
        >
          Reset
        </Button>
        <Timer running={running} finished={finished} />
      </div>
      <GithubOutlined
        onClick={() => {
          const tab = window.open(
            "https://github.com/jakubtelec/stay-home-sim",
            "_blank"
          );
          tab.focus();
        }}
        style={{ fontSize: 40, cursor: "pointer", color: THEME.GITHUB_LINK }}
      />
    </div>
  );
};

export default GeneralControls;
