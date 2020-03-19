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
    const { running } = this.props;
    if (prevProps.running !== running) {
      if (running) {
        this.ticker = setInterval(() => this.tick(), 100);
      } else {
        clearInterval(this.ticker);
        this.setState({ time: 0 });
      }
    }
  }

  render() {
    const { time } = this.state;
    const secs = Math.floor(time / 10);
    return (
      <div style={{ fontSize: 16 }}>
        Time running: {secs}.{time % 10} s
      </div>
    );
  }
}

export default Timer;
