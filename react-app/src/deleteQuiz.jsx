import React, { Component } from 'react';
import './quizes.css';
import { Redirect, Link } from 'react-router-dom'
import firebase from 'firebase';

class DeleteQuiz extends Component {
  constructor(props) {
    super();
    this.state = {
      quizId: props.match.params.qid
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    var _this  = this
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(idToken)
      fetch('http://127.0.0.1:8800/deletequiz/'+_this.state.quizId+'/', {
        method: 'GET',
        headers: new Headers({
          'authtok':idToken
        }),
      })
      .then(response => response.json())
        .then(data => _this.setState({data: data}) )
    })
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Deleted Successfully</h1>
        </header>        
      </div>
    )
  }

}
export default DeleteQuiz
