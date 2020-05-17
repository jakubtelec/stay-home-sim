import React from "react";
import { Slider } from "antd";

import "antd/dist/antd.css";

class Controls extends React.Component {
  state = {
    perc: 0,
  };

  updatePerc(perc) {
    // console.log("p", perc, this.props.percIsolated);
    this.setState({ perc });
    this.props.setPerc(perc);
  }

  componentDidMount() {
    this.updatePerc(this.props.percIsolated);
  }

  render() {
    const { percIsolated, running } = this.props;
    const { perc } = this.state;
    return (
      <div className="slider">
        <Slider
          disabled={running}
          min={0}
          max={100}
          onChange={(v) => this.updatePerc(v)}
          value={perc}
          style={{ width: "80%" }}
        />
        <div>{percIsolated}%</div>
      </div>
    );
  }
}

export default Controls;
