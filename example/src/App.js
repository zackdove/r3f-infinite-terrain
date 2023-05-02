import React, { Component } from "react";
import "./App.css";
import Hello from "r3f-infinite-terrain";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Hello text="World" />
      </div>
    );
  }
}

export default App;
