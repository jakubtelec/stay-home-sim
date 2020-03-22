import React from "react";
import p5 from "p5";
// import Controls from "./Controls.js";
import Chart from "./Chart.js";
import Info from "./Info.js";
import { THEME, POPULATION_SIZE } from "../../constants";
import { Card, Divider } from "antd";

import "../../styles.css";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      playgroundSize: 0,
      unaffected: POPULATION_SIZE - 1,
      infected: 1,
      highestInfected: 0,
      cured: 0,
      cureTime: 8 * 1000,
      initRender: true
    };
  }

  countStats(population, self) {
    const infected = population.filter(({ infected }) => infected).length;
    self.setState({
      unaffected: population.filter(
        ({ infected, cured }) => !infected && !cured
      ).length,
      infected,
      highestInfected:
        self.props.running && Math.max(infected, self.state.highestInfected),

      cured: population.filter(({ cured }) => cured).length
    });
    // if (population.some(({ cured, infected }) => cured && infected)) {
    //   console.log("Elo dupsko!");
    // }
  }

  Sketch = p => {
    const self = this,
      {
        countStats,
        props: { percIsolated, playgroundSize }
      } = self,
      atHome = Math.round((percIsolated / 100) * POPULATION_SIZE),
      displaySize = playgroundSize / 35,
      maxSpeed = displaySize / 8,
      spring = 0.05,
      friction = -0.9,
      population = [];

    p.setup = () => {
      p.createCanvas(playgroundSize, playgroundSize);
      for (let i = 0; i < POPULATION_SIZE; i++) {
        population[i] = new Person(
          p.random(playgroundSize),
          p.random(playgroundSize),
          displaySize,
          i,
          population,
          i < atHome
        );
      }
      population[POPULATION_SIZE - 1].infected = true;
      p.noStroke();
    };

    p.draw = () => {
      if (self.props.running || self.state.initRender) {
        p.background("white");
        if (self.state.initRender) {
          self.setState({ initRender: false });
        }
        if (!self.countInterval && !self.state.initRender)
          self.countInterval = setInterval(
            () => countStats(population, self),
            500
          );
        if (
          self.props.running &&
          !population[POPULATION_SIZE - 1].infectionTime
        )
          population[POPULATION_SIZE - 1].infectionTime = Date.now();

        population.forEach(person => person.checkStatus());

        population.forEach(person => {
          person.collide();
          person.move();
          person.display();
        });
      }
    };

    class Person {
      constructor(xin, yin, din, idin, oin, home) {
        this.x = xin;
        this.y = yin;
        this.vx = home ? 0 : p.random(-maxSpeed, maxSpeed);
        this.vy = home ? 0 : p.random(-maxSpeed, maxSpeed);
        this.diameter = din;
        this.id = idin;
        this.others = oin;
        this.infected = false;
        this.cured = false;
        this.infectionTime = 0;
        this.home = home;
      }

      checkStatus() {
        if (!this.cured && this.infected && this.infectionTime) {
          if (Date.now() - this.infectionTime > self.state.cureTime) {
            this.infected = false;
            this.cured = true;
            this.infectionTime = 0;
            console.log(this.infected);
          }
        }
      }

      collide() {
        for (let i = this.id + 1; i < POPULATION_SIZE; i++) {
          const other = this.others[i];
          let dx = other.x - this.x;
          let dy = other.y - this.y;
          let distance = p.sqrt(dx * dx + dy * dy);
          let minDist = other.diameter / 2 + this.diameter / 2;
          if (distance < minDist) {
            let angle = p.atan2(dy, dx);
            let targetX = this.x + p.cos(angle) * minDist;
            let targetY = this.y + p.sin(angle) * minDist;
            let ax = (targetX - other.x) * spring;
            let ay = (targetY - other.y) * spring;

            if (!this.home) {
              this.vx -= ax;
              this.vy -= ay;
            }
            if (!other.home) {
              other.vx += ax;
              other.vy += ay;
            }

            let target;
            if (this.infected && !other.infected) {
              target = other;
            } else if (!this.infected && other.infected) {
              target = this;
            }
            if (target && !target.cured) {
              target.infected = true;
              target.infectionTime = Date.now();
            }
          }
        }
      }

      move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x + this.diameter / 2 > playgroundSize) {
          this.x = playgroundSize - this.diameter / 2;
          this.vx *= friction;
        } else if (this.x - this.diameter / 2 < 0) {
          this.x = this.diameter / 2;
          this.vx *= friction;
        }
        if (this.y + this.diameter / 2 > playgroundSize) {
          this.y = playgroundSize - this.diameter / 2;
          this.vy *= friction;
        } else if (this.y - this.diameter / 2 < 0) {
          this.y = this.diameter / 2;
          this.vy *= friction;
        }
      }

      display() {
        p.fill(
          this.cured
            ? THEME.CURED
            : this.infected
            ? THEME.INFECTED
            : this.home
            ? THEME.AT_HOME
            : THEME.UNAFFECTED
        );
        p.ellipse(this.x, this.y, this.diameter, this.diameter);
      }
    }
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  componentWillUnmount() {
    clearInterval(this.countInterval);
  }

  render() {
    const { unaffected, infected, cured, highestInfected } = this.state;
    const { percIsolated, running, playgroundSize } = this.props;
    const atHome = Math.round((percIsolated / 100) * POPULATION_SIZE);
    return (
      <div className="card">
        <Card title={`Social distancing: ${percIsolated}%`}>
          {/* <Divider orientation="left">{"%"}</Divider> */}
          {/* <Controls percIsolated={percIsolated} />
          <Divider orientation="left">stats</Divider> */}
          <Info
            playgroundSize={playgroundSize}
            unaffected={unaffected}
            infected={infected}
            cured={cured}
            atHome={atHome}
            highestInfected={highestInfected}
          />
          <div ref={this.myRef} />
          <Divider orientation="left">timeline</Divider>
          <Chart
            playgroundSize={playgroundSize}
            unaffected={unaffected}
            infected={infected}
            cured={cured}
            highestInfected={highestInfected}
            running={running}
          />
        </Card>
      </div>
    );
  }
}

export default Board;
