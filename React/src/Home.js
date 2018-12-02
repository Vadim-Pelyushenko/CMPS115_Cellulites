import React, { Component } from "react";
import {
    Button,
    Grid, Row, Col,
    Tabs, Tab
    // Form, FormGroup, ControlLabel, FormControl
} from "react-bootstrap";

import * as box from './CodeBox.js';
import * as input from './input_controller.js'



// <script type="text/javascript" src="src/board.js"></script>
//     <script type="text/javascript" src="src/drawer.js"></script>
//     <script type="text/javascript" src="src/cell.js"></script>
//     <script type="text/javascript" src="src/input_controller.js"></script>
//     <script type="text/javascript" src="src/site_controller.js"></script>
//     <script type="text/javascript" src="src/game_of_life.js"></script>
//     <script type="text/javascript" src="src/rule30.js"></script>


class Home extends Component {
  render() {
    return (
      <div className="main_page">
        
        <Grid>
          <Row className="show-grid">
            {/*************** The LIFT half ***************/}
            <Col xs={12} md={8}>
              <p>
                The display should be placed here.
              </p>
              <div id = "output"></div>
              <Row><center>
                <Col xs="6" sm="4">
                  <Button bsStyle='success' onClick={input.runSimulation}> Start/Reset </Button>
                </Col>
                <Col xs="6" sm="4">
                  <Button bsStyle='danger' onClick={input.stopSimulation}> Stop </Button>
                </Col>
                <Col xs="6" sm="4">
                  <Button bsStyle='warning' onClick={input.resumeSimulation}> Resume </Button>
                </Col>
              </center></Row>
            </Col>

            {/*************** The RIGHT half ***************/}
            <Col xs={6} md={4}>
            <div className="tabs">
            <Tabs defaultActiveKey={3} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Environment">
                { codebox() }
              </Tab>
              
              <Tab eventKey={2} title="Cell">
                { codebox() }
              </Tab>

              <Tab eventKey={3} title="Something">
                { codebox() }
              </Tab>
            </Tabs>
            </div>
            
            </Col> {/* End of RIGHT side */}
          </Row>
        </Grid>
      </div>
    );


    // Function needed for the code text code to work modularity 
    function codebox() {
      return (
        <div><center>
          <h5>Code Box:</h5>
          <table><tr>
            <td colSpan={3}>
              <textarea id="inputTextToSave" cols={48} rows={25} defaultValue={""} />
            </td>
            </tr>
            <td>Filename to Save As:</td>
            <tr><td><input id="inputFileNameToSaveAs" /></td></tr>
            <Button bsStyle='info' bsSize="xsmall" onClick={box.saveTextAsFile}> Save Text to File </Button>
            <tr></tr>
            <td>Select a File to Load:</td>
            <tr><td><input type="file" id="fileToLoad" /></td></tr>
            <Button bsStyle='info' bsSize="xsmall" onClick={box.loadFileAsText}> Load Selected File </Button>
          </table>
        </center></div>
      )
    }
  }
}
 
export default Home;
