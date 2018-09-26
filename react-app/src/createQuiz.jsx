import React, { Component } from 'react';
import './newQuiz.css';
import firebase from 'firebase';
class NewQuiz extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        Qname: "",
        Genre: ""
      },
      submitted: false,
    }
    this.handleFChange = this.handleFChange.bind(this);
    this.handleLChange = this.handleLChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    var _this = this
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(idToken)
      var bod = {"authtok":idToken}
      console.log(bod)
      fetch('http://localhost:8800/newquiz/', {
       method: 'POST',
       headers: new Headers({
         'authtok':idToken
       }),
       body: JSON.stringify(_this.state.formData),
      })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
          _this.setState({submitted: true});
      });
    })
  }

  handleFChange(event) {
    this.state.formData.Qname = event.target.value;
  }
  handleLChange(event) {
    this.state.formData.Genre = event.target.value;
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Create a New Quiz</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Quiz Name</label>
                <input type="text" className="form-control" onChange={this.handleFChange}/>
            </div>
            <div className="form-group">
                <label>Genre</label>
                <input type="text" className="form-control" onChange={this.handleLChange}/>
            </div>
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              New Quiz successfully added.
            </h2>
          </div>
        }
      </div>
    );
  }
}

export default NewQuiz;
