import React, { Component } from "react";
import {
    Button,
    Grid, Row, Col,
    Tabs, Tab
    // Form, FormGroup, ControlLabel, FormControl
} from "react-bootstrap";
// import {
//   saveTextAsFile,
//   loadFileAsText
// } from './CodeBox.js'
import {
  saveTextAsFile,
  loadFileAsText
} from './CodeBox'
import {
  runSimulation,
  stopSimulation,
  resumeSimulation
} from './input_controller'

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
                  <Button bsStyle='success' onClick={runSimulation}> Start/Reset </Button>
                </Col>
                <Col xs="6" sm="4">
                  <Button bsStyle='danger' onClick={stopSimulation}> Stop </Button>
                </Col>
                <Col xs="6" sm="4">
                  <Button bsStyle='warning' onClick={resumeSimulation}> Resume </Button>
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
            <Button bsStyle='info' bsSize="xsmall" onClick={saveTextAsFile}> Save Text to File </Button>
            <tr></tr>
            <td>Select a File to Load:</td>
            <tr><td><input type="file" id="fileToLoad" /></td></tr>
            <Button bsStyle='info' bsSize="xsmall" onClick={loadFileAsText}> Load Selected File </Button>
          </table>
        </center></div>
      )
    }
  }
}
 
export default Home;
