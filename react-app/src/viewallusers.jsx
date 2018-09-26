import React, { Component } from 'react';
import './quizes.css';
import { Redirect, Link } from 'react-router-dom'
import firebase from 'firebase';

class ViewAllUsers extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  
  componentDidMount() {
    var _this  = this
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(idToken)
      fetch('http://127.0.0.1:8800/ViewAllUsers/', {
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
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">All Users</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>Display Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>{
            this.state.data.map(function(option,i){
                return (
                    <tr key = {i}>
                        <td>{option.name}</td>
                        <td>{option.email}</td>
                    </tr>
                  )
              })
          }
          
          </tbody> 
       </table>
      </div>
    );
  }
}

export default ViewAllUsers;
