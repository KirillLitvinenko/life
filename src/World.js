import React, { Component } from 'react';
import universe from './utils/universe';
import Cell from './Components/Cell'

export default class World extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universe: new universe(),
      size: {
        rows: 20,
        cols: 20,
      },
      gameRunning: false,
      interval: 100
    };

    this.handleChaneCellsNumber = this.handleChaneCellsNumber.bind(this);
    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.storeCell = this.storeCell.bind(this);
  }

  handleChaneCellsNumber(event, direction) {
    if (!this.state.gameRunning) {

      let value = event.target.value;

      this.setState(
        prevState => ({
          size: {
            ...prevState.size,
            [direction]: value
          },
        })
      );

      this.renderBoard();
    }
  }

  changeInterval = (event) => {
    if (!this.state.gameRunning) {
      this.setState(
        {
          interval: event.target.value
        }
      )
    }
  }

  startGame() {
    if (!this.state.gameRunning) {
      this.setState(
        {
          gameRunning: true,
        }, () => {
          this.intervalRef = setInterval(() => this.nextTick(), this.state.interval);
        }
      )
    }
  }

  stopGame() {
    this.setState(
      {
        gameRunning: false
      }, () => {
        if (this.intervalRef) {
          clearInterval(this.intervalRef);
        }
      }
    )
  }

  resetGame() {
    this.stopGame();
    this.setState({universe: new universe()})
  }

  nextTick() {
    this.setState(
      {
        universe: this.state.universe.addGeneration()
      }
    )
  }

  storeCell(position) {
    if (!this.state.gameRunning) {
      this.setState(
        {
          universe: this.state.universe.storeCell(position)
        }
      )
    }
  }

  renderBoard() {
    let newWorld = [];
    let cellRow = [];

    for (let i = 0; i < this.state.size.cols; i++) {
      for (let j = 0; j < this.state.size.rows; j++) {
        if (this.state.universe.isCellAlive(i + " , " + j)) {
          cellRow.push(
            <Cell key={[i, j]} position={{ x: i, y: j }} live={true} storeCell={this.storeCell.bind(this)}/>
          );
        } else {
          cellRow.push(
            <Cell key={[i, j]} position={{ x: i, y: j }} live={false} storeCell={this.storeCell.bind(this)}/>
          );
        }
      }
      newWorld.push(<div className="row" key={i}>{cellRow}</div>);
      cellRow = [];
    }

    return newWorld;
  }

  render() {
    return (
      <div className="worldContainer">
        <div className="headerContainer">
          <div className="headerInnerContainer">
            <label className="label">
              Rows:
              <input
                className="input"
                type="number"
                value={this.state.size.rows}
                onChange={event => this.handleChaneCellsNumber(event, 'rows')}
              />
            </label>
            <label className="label">
              Columns:
              <input
                className="input"
                type="number"
                value={this.state.size.cols}
                onChange={event => this.handleChaneCellsNumber(event, 'cols')}
              />
            </label>
            <label className="label">
              Interval:
              <input className="input" type="number" value={this.state.interval} onChange={this.changeInterval}/>
            </label>
          </div>
          <div className="headerButtons">
            <button className="submit" onClick={this.startGame}>Start</button>
            <button className="submit" onClick={this.stopGame}>Stop</button>
            <button className="submit" onClick={this.resetGame}>Reset</button>
          </div>
          Generation: {this.state.universe.getGeneration()}
        </div>
        <div className="boardContainer">
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}