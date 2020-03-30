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
      height = playgroundSize / 4;
    const getBarHeight = num => (num / POPULATION_SIZE) * height;

    p.setup = () => {
      p.createCanvas(playgroundSize, height);
      p.noLoop();
      // p.noStroke();
    };

    p.draw = () => {
      const { chartData } = self.props;
      p.background(THEME.CHART_BACKGROUND);

      const step = playgroundSize / (chartData.length - 1);

      for (let i = 0; i < chartData.length - 1; i++) {
        const { infected, cured } = chartData[i],
          { infected: nextInfected, cured: nextCured } =
            chartData[i + 1] || chartData[i];

        const infectedSize = getBarHeight(infected),
          nextInfectedSize = getBarHeight(nextInfected);

        const curedSize = getBarHeight(cured),
          nextCuredSize = getBarHeight(nextCured);

        const startX = i * step;
        const endX = i * step + step;

        p.fill(THEME.INFECTED);
        p.stroke(THEME.INFECTED);
        p.quad(
          startX,
          height,
          startX,
          height - infectedSize,
          endX,
          height - nextInfectedSize,
          endX,
          height
        );
        p.fill(THEME.CURED);
        p.stroke(THEME.CURED);
        p.quad(startX, 0, startX, curedSize, endX, nextCuredSize, endX, 0);
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
