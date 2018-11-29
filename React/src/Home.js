import React, { Component } from "react";
import {
    Button,
    Grid, Row, Col,
    Tabs, Tab, 
    Form, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

class Home extends Component {
  render() {
    return (
      <div>
        {/* <h2>Simulator</h2>
        <p>This is where we would put in the main simulation part</p> */}
        
        <Grid>
          <Row className="show-grid">
            {/* The LEFT half */}
            <Col xs={12} md={8}>
              <p>
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
              </p>

              <Row>
                <Col xs="6" sm="4">
                  <Button bsStyle='success'> Start/Reset </Button>
                </Col>
                <Col xs="6" sm="4">
                  <Button bsStyle='danger'> Stop </Button>
                </Col>
                <Col sm="4">
                  <Button bsStyle='warning'> Resume </Button>
                </Col>
              </Row>
            </Col>

            {/* The RIGHT half */}
            <Col xs={6} md={4}>
            <div className="tabs">
              <Tabs defaultActiveKey={3} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Environment">
                  <Form>
                    <FormGroup controlId="formControlsTextarea">
                      <ControlLabel>Textarea</ControlLabel>
                      <FormControl componentClass="textarea" placeholder="textarea" />
                    </FormGroup>
                  </Form>
                </Tab>
                <Tab eventKey={2} title="Cell">
                    Tab 2 content
                </Tab>
                <Tab eventKey={3} title="Something">
                    Tab 3 content
                </Tab>
              </Tabs>
              </div>
            </Col>
            
          </Row>
        </Grid>
      </div>
    );
  }
}
 
export default Home;
