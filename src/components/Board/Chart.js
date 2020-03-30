import React, { PureComponent } from "react";
import p5 from "p5";
import { THEME, POPULATION_SIZE } from "../../constants";

import "../../styles.css";

class Chart extends PureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  Sketch = p => {
    const self = this;
    const { playgroundSize } = self.props,
      height = playgroundSize / 5;

    p.setup = () => {
      p.createCanvas(playgroundSize, height);
      p.noLoop();
      // p.noStroke();
    };

    p.draw = () => {
      const { chartData } = self.props;
      p.background(THEME.CHART_BACKGROUND);

      const step = playgroundSize / chartData.length;

      for (let i = 0; i < chartData.length; i++) {
        const { infected, cured } = chartData[i];
        const infectedSize = (infected / POPULATION_SIZE) * height;
        const curedSize = (cured / POPULATION_SIZE) * height;

        p.fill(THEME.INFECTED);
        p.stroke(THEME.INFECTED);
        p.rect(i * step, height - infectedSize, step, height);
        p.fill(THEME.CURED);
        p.stroke(THEME.CURED);
        p.rect(i * step, 0, step, curedSize);
      }
    };
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  render() {
    if (this.myP5) this.myP5.draw();
    return (
      <div>
        <div ref={this.myRef} />
      </div>
    );
  }
}

export default Chart;
