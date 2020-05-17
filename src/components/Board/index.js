import React from "react";
import p5 from "p5";
import Controls from "./Controls.js";
import Chart from "./Chart.js";
import Info from "./Info.js";
import {
  THEME,
  POPULATION_SIZE,
  DELTA_FACTOR,
  SHOW_FPS,
  HALO_DURATION,
} from "../../constants";
import { Card, Divider } from "antd";
import { hashify, getNeighbours } from "../../helpers";

import "../../styles.css";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      playgroundSize: 0,
      unaffected: POPULATION_SIZE - 1,
      infected: 1,
      homeUnaffected: 0,
      highestInfected: 0,
      cured: 0,
      chartData: [],
      cureTime: 8 * 1000,
      initRender: true,
    };
  }

  updateStats(population, self) {
    // general population data
    const state = population.reduce(
      (acc, next) => {
        acc.infected += Number(next.infected);
        acc.unaffected += Number(!next.infected && !next.cured);
        acc.homeUnaffected += Number(next.home && !next.infeted);
        acc.cured += Number(next.cured);
        return acc;
      },
      { unaffected: 0, infected: 0, homeUnaffected: 0, cured: 0 }
    );
    state.highestInfected = Math.max(
      state.infected,
      self.state.highestInfected
    );
    // chart data
    const { chartData } = self.state,
      { infected, cured } = state,
      { running } = self.props;

    if (running) {
      state.chartData = [...chartData, { infected, cured }];
    } else state.chartData = chartData;
    //
    // check if infected state is finished
    if (infected === 0) {
      self.props.setFinished(true);
    }
    self.setState(state);
  }

  Sketch = (p) => {
    const self = this,
      {
        updateStats,
        props: { percIsolated, playgroundSize },
      } = self,
      atHome = Math.round((percIsolated / 100) * POPULATION_SIZE),
      bucketSize = playgroundSize / 20,
      displaySize = playgroundSize / 35,
      maxSpeed = displaySize / 5,
      spring = 0.05,
      friction = -0.9,
      population = [];

    let fps = 0,
      lastTimestamp = 0,
      lastFramesCount = 0;

    const initPopulation = () => {
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
    };

    const spawnP5 = () => {
      p.createCanvas(playgroundSize, playgroundSize);
      initPopulation();
      p.noStroke();
    };

    p.respawnP5 = function () {
      p.resizeCanvas(playgroundSize, playgroundSize);
      initPopulation();
      p.noStroke();
      self.setState((oldState)) => ({ ...oldState, initRender: true }));
    };

    p.setup = () => {
      spawnP5();
    };

    p.draw = () => {
      if (SHOW_FPS && Date.now() >= lastTimestamp + 1000) {
        fps = p.frameCount - lastFramesCount;
        lastFramesCount = p.frameCount;
        lastTimestamp = Date.now();
      }

      if (self.props.running || self.state.initRender) {
        p.background("white");
        if (self.state.initRender) {
          self.setState({ initRender: false });
        }
        if (!self.countInterval && !self.state.initRender)
          self.countInterval = setInterval(
            () => updateStats(population, self),
            500
          );
        if (
          self.props.running &&
          !population[POPULATION_SIZE - 1].infectionTime
        )
          population[POPULATION_SIZE - 1].infectionTime = Date.now();

        population.forEach((person) => person.checkStatus());

        const hashed = hashify(population, bucketSize);

        population.forEach((person) => {
          person.collide(hashed, bucketSize);
        });

        population.forEach((person) => {
          person.move();
          person.display();
        });

        if (SHOW_FPS) {
          p.fill("black");
          p.text(`FPS: ${fps}`, 10, 10);
        }
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
          }
        }
      }

      collide(hashed, bucketSize) {
        const neighbours = getNeighbours(this, hashed, bucketSize);
        for (const other of neighbours) {
          let dx = other.x - this.x,
            dy = other.y - this.y;
          let distance = p.sqrt(dx * dx + dy * dy),
            minDist = other.diameter / 2 + this.diameter / 2;
          if (distance < minDist) {
            let angle = p.atan2(dy, dx),
              targetX = this.x + p.cos(angle) * minDist,
              targetY = this.y + p.sin(angle) * minDist,
              ax = (targetX - other.x) * spring,
              ay = (targetY - other.y) * spring;
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
        this.x += this.vx * (p.deltaTime / DELTA_FACTOR);
        this.y += this.vy * (p.deltaTime / DELTA_FACTOR);
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
        p.noStroke();
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

        const sinceInfection = this.infected && Date.now() - this.infectionTime;

        if (sinceInfection && sinceInfection < HALO_DURATION) {
          const haloSize =
            this.diameter +
            (this.diameter * 4 * sinceInfection) / HALO_DURATION;
          const haloColor = p.color(THEME.INFECTED);
          haloColor.setAlpha(255 - (sinceInfection / HALO_DURATION) * 255);
          p.noFill();
          p.stroke(haloColor);
          p.ellipse(this.x, this.y, haloSize, haloSize);
        }
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
    const {
      unaffected,
      infected,
      cured,
      highestInfected,
      homeUnaffected,
      chartData,
    } = this.state;
    const { percIsolated, playgroundSize, setPerc, running } = this.props;
    const atHome = Math.round((percIsolated / 100) * POPULATION_SIZE);

    return (
      <Card>
        <button
          onClick={() => {
            // console.log(this.myP5);
            this.myP5.respawnP5();
          }}
        >
          Elo
        </button>
        <Controls
          percIsolated={percIsolated}
          setPerc={setPerc}
          running={running}
        />
        <Divider></Divider>
        <Info
          playgroundSize={playgroundSize}
          unaffected={unaffected}
          infected={infected}
          cured={cured}
          atHome={atHome}
          highestInfected={highestInfected}
          percIsolated={percIsolated}
          homeUnaffected={homeUnaffected}
        />
        <div ref={this.myRef} />
        <Chart playgroundSize={playgroundSize} chartData={chartData} />
      </Card>
    );
  }
}

export default Board;
