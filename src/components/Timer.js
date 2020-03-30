import React from "react";

import "antd/dist/antd.css";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  tick() {
    this.setState({ time: this.state.time + 1 });
  }

  componentDidUpdate(prevProps) {
    const { running, finished } = this.props;
    if (prevProps.running !== running) {
      if (running && !finished) {
        this.ticker = setInterval(() => this.tick(), 100);
      } else {
        clearInterval(this.ticker);
        if (!finished) this.setState({ time: 0 });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  render() {
    const { time } = this.state;
    const { finished } = this.props;
    const secs = Math.floor(time / 10);
    return (
      <div style={{ fontSize: 16 }}>
        Time running: {secs}.{time % 10}{" "}
      </div>
    );
  }
}

export default Timer;
