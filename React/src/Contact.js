import React, { Component } from "react";
import ReactContactForm from 'react-mail-form';


class Contact extends Component {
  render() {
    return (
      <div>
        <h2>GOT QUESTIONS?</h2>
        <p>Send us an email!</p>
        <ReactContactForm to="cellularautomatasimulation@gmail.com" />

        <p>Yes I know these don't look too hot... But hey it actually works yo!!!</p>
      </div>
    );
  }
}
 
export default Contact;
