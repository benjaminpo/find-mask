import React, { Component } from 'react';
import './Foot.css';

class Foot extends Component {
  public render() {
    return (
      <footer className="Foot">
        <a href="https://www.buymeacoffee.com/benjaminpo" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" />
        </a>
      </footer>
    );
  }
}

export default Foot;
