import React, { Component } from 'react';

class Cell extends Component {
  render() {
    return (
      <div
        onClick={() => this.props.storeCell(this.props.position)}
        className={`cell ${this.props.live ? 'cellContainerLive' : ''}`}
      />
    );
  }
}

export default Cell;
