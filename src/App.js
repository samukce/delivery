import React, { Component } from 'react';
import {Input, Row} from 'react-materialize'

class App extends Component {
  render() {
    return (
      <Row>
        <Input s={12} label="Address" />
      </Row>
    );
  }
}

export default App;
