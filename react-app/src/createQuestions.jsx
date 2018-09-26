import React, { Component } from 'react';
import './newQuiz.css';
import firebase from 'firebase';


class NewQuestion extends Component {
  constructor(props) {
    super();
    this.state = {
      formData1: {
        quizId: props.match.params.qid,
        qtext: "",
        qtype: "1",
      },
      formData2: [
      {
        qid: "",
        otext: "",
        correct: "false",
      },
      {
        qid: "",
        otext: "",
        correct: "false",
      },
      {
        qid: "",
        otext: "",
        correct: "false",
      },
      {
        qid: "",
        otext: "",
        correct: "false",
      },
      ],      

      submitted: false,
    }
    this.handleqtextChange = this.handleqtextChange.bind(this);
    this.handleotextChange = this.handleotextChange.bind(this);
    this.handleqtypeChange = this.handleqtypeChange.bind(this);
    this.handlecorrectChange = this.handlecorrectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    var _this = this
    console.log("HERE")
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log("TOKEN COMING UP")
      console.log(idToken)

      
      fetch('http://localhost:8800/newquestion/', {
        method: 'POST',
        headers: new Headers({
          'authtok':idToken
        }),
        body: JSON.stringify(_this.state.formData1),
      })
        .then(response => response.json())
        .then(jsonresp => {
          console.log(jsonresp)
          var qid= jsonresp.id
          for (var i = 0; i < _this.state.formData2.length; i++) {
            _this.state.formData2[i].qid = qid
          }
          fetch('http://localhost:8800/newoptions/',{
            method: 'POST',
            headers: new Headers({
              'authtok':idToken
            }),
            body: JSON.stringify(_this.state.formData2),
          })
          .then(resp2 => {
            if(resp2.status === 200){
              _this.setState({submitted:true})
            }
          })     
        })


    })
  }


  handleqtextChange(event) {
      this.state.formData1.qtext = event.target.value;
  }
  handleqtypeChange(event) {
    this.state.formData1.qtype = event.target.checked ? "2" : "1";
  }

  handleotextChange(event) {
    var id = event.target.id
    this.state.formData2[id].otext = event.target.value;
  }

  handlecorrectChange(event) {
    var id = event.target.id
    this.state.formData2[id].correct = event.target.checked ? "true" : "false";
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Create a New Question</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Question Text</label>
                <input type="text" className="form-control" onChange={this.handleqtextChange}/>
            </div>
            <div className="form-group">
                <label>Multiple correct?
                <input type="checkbox" className="form-control" onChange={this.handleqtypeChange}/>
                </label>
            </div>
            <div className="form-group">
                <label>Option 1</label>
                <input type="text" className="form-control" onChange={this.handleotextChange} id ='0'/>
                <label>correct</label>
                <input type="checkbox" className="form-control" onChange={this.handlecorrectChange} id ='0'/>
            </div>
            <div className="form-group">
                <label>Option 2</label>
                <input type="text" className="form-control" onChange={this.handleotextChange} id ='1'/>
                <label>correct</label>
                <input type="checkbox" className="form-control" onChange={this.handlecorrectChange} id ='1'/>
            </div>
            <div className="form-group">
                <label>Option 3</label>
                <input type="text" className="form-control" onChange={this.handleotextChange} id ='2'/>
                <label>correct</label>
                <input type="checkbox" className="form-control" onChange={this.handlecorrectChange} id ='2'/>
            </div>
            <div className="form-group">
                <label>Option 4</label>
                <input type="text" className="form-control" onChange={this.handleotextChange} id ='3'/>
                <label>correct</label>
                <input type="checkbox" className="form-control" onChange={this.handlecorrectChange} id ='3'/>
            </div>


                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              New Question successfully added.
            </h2>
          </div>
        }
      </div>
    );
  }
}

export default NewQuestion;
