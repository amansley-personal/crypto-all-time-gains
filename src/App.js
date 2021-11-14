import React, { useState, useEffect } from 'react';
import './App.css';
import { ApplicationContext } from './Context';
import InnerApp from './InnerApp';
import axios from "axios"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      application: {
        name: "All Time Crypto Gains ",
        version: 1.0
      }
    }
  }

  render() {
    return (
      <>
        <InnerApp state={this.state} />
      </>
    )
  }
}

export default App;
