import React from "react";
import Board from "./Board";
import GeneralControls from "./GeneralControls";
import { THEME } from "../constants";
import { computeSizes } from "../helpers";

import "antd/dist/antd.css";
import "../styles.css";

// TODO: simplify!
const defaultBoards = [
  { percIsolated: 0 },
  { percIsolated: 50 },
  { percIsolated: 75 },
  { percIsolated: 90 }
];

class App extends React.Component {
  state = {
    boards: [...defaultBoards],
    keyAffix: Date.now(),
    running: false
  };

  resetFields() {
    const { examplesNum } = computeSizes();
    this.setState({
      boards: defaultBoards.slice(0, examplesNum),
      keyAffix: Date.now(),
      running: false
    });
  }

  start() {
    this.setState({ running: true });
  }

  componentDidMount() {
    this.resetFields();
    window.addEventListener("resize", () => this.resetFields());
  }

  render() {
    const { boards, running, keyAffix } = this.state;
    const { playgroundSize } = computeSizes();
    return (
      <>
        <div className="dashboard" style={{ background: THEME.BACKGROUND }}>
          <div className="panel">
            <GeneralControls
              start={() => this.start()}
              resetFields={() => this.resetFields()}
              running={running}
              playgroundSize={playgroundSize}
            />
            <div className="boards">
              {boards.map(({ percIsolated }, idx) => (
                <div
                  style={{
                    marginRight: idx < boards.length - 1 ? "24px" : "0"
                  }}
                  key={`board_${idx}_${keyAffix}`} // workaround: changing key name remounts component
                >
                  <Board
                    playgroundSize={playgroundSize}
                    percIsolated={percIsolated}
                    running={running}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
