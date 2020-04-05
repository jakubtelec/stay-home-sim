import React from "react";
import debounce from "debounce";
import Board from "./Board";
import GeneralControls from "./GeneralControls";
import { THEME } from "../constants";
import { computeSizes, getDefaultBoards } from "../helpers";

import "antd/dist/antd.css";
import "../styles.css";

class App extends React.Component {
  state = {
    boards: getDefaultBoards(),
    keyAffix: Date.now(),
    running: false,
    finished: false,
  };

  resetFields() {
    const { examplesNum } = computeSizes();
    this.setState({
      boards: getDefaultBoards().slice(0, examplesNum),
      keyAffix: Date.now(),
      running: false,
      finished: false,
    });
  }

  start() {
    this.setState({ running: true });
  }

  componentDidMount() {
    this.resetFields();
    window.addEventListener("resize", () => this.resetFields());
  }

  setFinished(idx) {
    const newBoards = this.state.boards;
    newBoards[idx].finished = true;
    if (newBoards.every(({ finished }) => finished))
      this.setState({ finished: true, running: false });
    this.setState({ boards: newBoards });
  }

  setPerc = debounce((idx, perc) => {
    if (idx) {
      const newBoards = this.state.boards;
      newBoards[idx].percIsolated = perc;
      this.setState({ boards: newBoards });
    }
  }, 500);

  render() {
    const { boards, running, finished, keyAffix } = this.state;
    const { playgroundSize, playgroundsContainerSize } = computeSizes();
    return (
      <>
        <div className="dashboard" style={{ background: THEME.BACKGROUND }}>
          <div
            className="panel"
            style={{
              width: playgroundsContainerSize,
            }}
          >
            <GeneralControls
              start={() => this.start()}
              resetFields={() => this.resetFields()}
              running={running}
              finished={finished}
              playgroundsContainerSize={playgroundsContainerSize}
            />
            <div className="boards">
              {boards.map(({ percIsolated }, idx) => (
                <div
                  style={{
                    marginRight: idx < boards.length - 1 ? "24px" : "0",
                  }}
                  key={`board_${idx}_${keyAffix}_${percIsolated}`} // workaround: changing key name remounts component = resest p5
                >
                  <Board
                    playgroundSize={playgroundSize}
                    percIsolated={percIsolated}
                    running={running}
                    finished={finished}
                    setFinished={() => this.setFinished(idx)}
                    setPerc={(v) => this.setPerc(idx, v)}
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
