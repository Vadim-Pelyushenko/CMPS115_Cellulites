import React, { Component } from "react";
import { Button } from "react-bootstrap";

class Manual extends Component {
  render() {
    return (
      <div>
        <h2>What is Cellular Automata?</h2>
        <p>Good question! And we're here to help :D</p>




        <Button bsStyle='info' href="The_Manual.pdf" download="Celluar_Automata_Manual.pdf">
        Click here to download manual PDF!
        </Button>

      </div>
    );
  }
}
 
export default Manual;
