import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  printBtn() {
    // this.setState({'isPrinting': true})
    setTimeout(() => {
      console.log('1');
        if(window.electron){
          console.log('2');
            // window.electron.ipcRenderer.send('printContent');
            const div_to_be_targeted="test";
            window.electron.ipcRenderer.send("printPDF", div_to_be_targeted);
        }
    })
  }

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

          <button className="confirm-btn" onClick={this.printBtn.bind(this)}>
            Print
          </button>
        </header>
      </div>
    );
  }
}

export default App;
