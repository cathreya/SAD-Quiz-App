import React, { Component } from 'react';
import NewComponent from './NewComponent';
import './home.css'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import {Link} from 'react-router-dom'

class Logout extends Component {
  constructor() {
    super();
    this.state = {
      data: [],     
      isAdmin: (firebase.auth().currentUser.email == 'admin@admin.com')
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    var _this  = this
    console.log() 
    
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(idToken)      
      fetch('http://127.0.0.1:8800/myscores/'+firebase.auth().currentUser.displayName+'/', {
        method: 'GET',
        headers: new Headers({
          'authtok':idToken
        }),
      })
      .then(response => response.json())
        .then(data => _this.setState({data: data}) )
    })
  }

  render() {
    var _this = this 
    if(this.state.data.length > 0){
        return (
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">My Quizes</h1>
            </header>
            
            <button className='btn-danger' onClick={() => firebase.auth().signOut()}>Sign Out</button>
            <table className="table-hover">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>{
                this.state.data.map(function(option,i){
                    return (
                        <tr key = {i}>
                            <td>{option.qname}</td>
                            <td>{option.score}</td>
                        </tr>
                      )
                  })
              }
              </tbody> 
           </table>
          </div>
        );
      }
      else{
        return(
          <div className="App">
              <header className="App-header">
                <h1 className="App-title">My Quizes</h1>
              </header>
              <h3> No quizes yet, click on the Quizes tab to get started! </h3>
              <button className='btn-danger' onClick={() => firebase.auth().signOut()}>Sign Out</button>
          </div>
        )
      }
    }
}

export default Logout;


