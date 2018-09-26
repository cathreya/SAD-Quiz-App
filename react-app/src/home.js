import React, { Component } from 'react';
import NewComponent from './NewComponent';
import './home.css'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

class Home extends Component {

  componentDidMount() {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(idToken)
      var bod = {"authtok":idToken}
      console.log(bod)
      fetch('http://localhost:8800/tokentest/', {
        method: 'GET',
        headers: new Headers({
          'authtok':idToken
        }),
      })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
          console.log("Ok")
      });
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the SAD Quiz App</h1>
        </header>
        <h3> Click on the quizes tab to get started! </h3>
      </div>
    );
  }
}
export default Home;


