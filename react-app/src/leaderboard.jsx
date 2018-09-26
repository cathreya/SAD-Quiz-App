import React, { Component } from 'react';
import './quizes.css';
import { Redirect, Link } from 'react-router-dom'
import firebase from 'firebase';

class Leaderboard extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      which:"",
    }
    this.whichHandler = this.whichHandler.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    var _this  = this
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(idToken)
      fetch('http://127.0.0.1:8800/getleader/', {
        method: 'GET',
        headers: new Headers({
          'authtok':idToken
        }),
      })
      .then(response => response.json())
        .then(data => _this.setState({data: data}) )
    })
  }

  whichHandler(event){
    this.setState({which:event.target.value})
  }

  submitHandler(event){
    if(this.state.which.length == 0){
      var _this  = this
      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        console.log(idToken)
        fetch('http://127.0.0.1:8800/getleader/', {
          method: 'GET',
          headers: new Headers({
            'authtok':idToken
          }),
        })
        .then(response => response.json())
          .then(data => _this.setState({data: data}) )
      })   
    }
    else{
      var _this  = this
      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        console.log(idToken)
        fetch('http://127.0.0.1:8800/getleader/'+_this.state.which+'/', {
          method: 'GET',
          headers: new Headers({
            'authtok':idToken
          }),
        })
        .then(response => response.json())
          .then(data => _this.setState({data: data}) )
      })
    }
  }



  render() {
    var _this = this 
    if(this.state.data.length > 0){
        return (
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Leaderboard!</h1>
            </header>

            <input type="text" onChange={_this.whichHandler} />
            <input type="submit" onClick={_this.submitHandler} />
            <table className="table-hover">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Total Score (All Time)</th>
                </tr>
              </thead>
              <tbody>{
                this.state.data.map(function(option,i){
                    return (
                        <tr key = {i}>
                            <td>{option.user}</td>
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
                <h1 className="App-title">Leaderboard!</h1>
              </header>
              <h3> No Such Leaderboard Found :C </h3>
              <input type="text" onChange={_this.whichHandler} />
              <input type="submit" onClick={_this.submitHandler} />
          </div>
        )
      }
    }
}

export default Leaderboard;
