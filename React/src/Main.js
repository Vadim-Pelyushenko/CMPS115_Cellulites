import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import Manual from "./Manual";
import About from "./About";
import Contact from "./Contact";

 
class Main extends Component {
    render() {
      return (
        <HashRouter>
          <div>

            {/* Implement in built-in React font styles */}
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            </link>
           
            <h1>Cellular Automata Simulation :D</h1>
            <ul className="header">
              <li><NavLink exact to="/">Home</NavLink></li>
              <li><NavLink to="/manual">Manual</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
            </ul>
            <div className="content">
              <Route exact path="/" component={Home}/>
              <Route path="/manual" component={Manual}/>
              <Route path="/about" component={About}/>
              <Route path="/contact" component={Contact}/>
            </div>
          </div>
        </HashRouter>
      );
    }
}
 
export default Main;
