import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  print = () => {
    window.printer.printDirect({
      data:"print from Node.JS buffer" // or simple String: "some text"
      ,
      type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
      ,
      success:function(jobID) {
        console.log("sent to printer with ID: "+jobID);
      },
      error:function(err){ console.log(err); }
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            \o/ Irra
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.print.bind(this)}>Print</button>
        </header>
      </div>
    );
  }
}

export default App;
