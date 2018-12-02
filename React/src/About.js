import React, { Component } from "react";
import teampic from'./_teampic.png';
 
class About extends Component {
  render() {
    return (
      <div>
        <h2>About Us!</h2>
        <p>
          We chose to create the cellular automata simulator to educate the general public on what a cellular automata is, how it works, and how an individual can make their own.
        </p>
        
        <br />
        <img  src={teampic} alt="Team" max-width="100%" max-height="100%" margin="auto"/>
        
        <h3>Meet Our Team</h3>
        <p>
        <li> <b>Vadim Pelyushenko:</b> Product Owner, Coordinator, Language Developer </li>
            <li> <b>Volha Hancharova:</b> Web Master </li>
            <li> <b>Ismael Chavez III:</b> Tool Coder, Assistant Language Developer </li>
            <li> <b>Maia Dupuis:</b> UI Development </li>
            <li> <b>Annie Shen:</b> Language Developer, File Expert </li>
        </p>
        
        <br />

        <p>
          We are a team of dedicated UC Santa Cruz computer science students that are very passionate about learning and technology.<br />
          This project was created for our intro to software engineering course (CMPS 115). This project was created using the agile methodology and to practice our understanding of scrum theory before we move on to using it in the real world.
        </p>
        
        <br />
        
        <a href="https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_539,w_960,x_0,y_0/dpr_2.0/c_limit,w_740/fl_lossy,q_auto/v1493062752/galleries/2011/05/05/cute-seals/cute-seals-4_owyiga">Check out our Github</a>
      </div>
    );
  }
  
}
 
export default About;
