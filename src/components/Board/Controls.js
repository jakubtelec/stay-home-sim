import React from "react";
import { Slider, Row, Col } from "antd";

import "antd/dist/antd.css";

class Controls extends React.Component {
  render() {
    const { percIsolated } = this.props;
    return (
      <Row>
        <Col flex={5}>
          <Slider
            min={0}
            max={100}
            onChange={this.onChange}
            value={percIsolated}
          />
        </Col>
        <Col flex={1}>
          <div>{percIsolated}%</div>
        </Col>
      </Row>
    );
  }
}

export default Controls;
