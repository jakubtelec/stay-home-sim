import React, { PureComponent } from "react";
import p5 from "p5";
import { THEME, POPULATION_SIZE } from "../../constants";

import "../../styles.css";

class Chart extends PureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      data: []
    };
  }

  Sketch = p => {
    const self = this;
    const { playgroundSize } = self.props,
      height = playgroundSize / 5;

    p.setup = () => {
      p.createCanvas(playgroundSize, height);
      p.noLoop();
      p.noStroke();
    };

    p.draw = () => {
      const { data } = self.state;
      p.background(THEME.CHART_BACKGROUND);

      const step = playgroundSize / data.length;

      for (let i = 0; i < data.length; i++) {
        const { infected, cured } = data[i];
        const infectedSize = (infected / POPULATION_SIZE) * height;
        const curedSize = (cured / POPULATION_SIZE) * height;

        p.fill(THEME.INFECTED);
        p.rect(i * step, height - infectedSize, i * step + step, height);
        p.fill(THEME.CURED);
        p.rect(i * step, 0, i * step + step, curedSize);
      }
    };
  };

  addData() {
    const { infected, cured } = this.props;
    const { data } = this.state;
    if (this.props.running) {
      const newData = [...data, { infected, cured }];
      this.setState({ data: newData });
      if (this.myP5) this.myP5.draw();
    }
    // if (infected) this.timeout = setTimeout(() => this.addData(), 100);
  }

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
    this.addData();
  }

  render() {
    return (
      <div>
        <div ref={this.myRef} />
      </div>
    );
  }
}

export default Chart;
