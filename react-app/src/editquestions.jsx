import React, { Component } from 'react';
import './newQuiz.css';
import firebase from 'firebase';


class EditQuestion extends Component {
  constructor(props) {
    super();
    this.state = {
      cur:0,
      data:[],
      qid:props.match.params.qid,
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
    this.nextQuestion = this.nextQuestion.bind(this);
  }

  componentDidMount() {
    var _this  = this
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(idToken)
      fetch('http://127.0.0.1:8800/quiz/'+_this.state.qid+'/', {
        method: 'GET',
        headers: new Headers({
          'authtok':idToken
        }),
      })
      .then(response => response.json())
        .then(data => {
          _this.setState({data: data}) 
          _this.state.formData1 = _this.state.data[0].Question
          _this.state.formData2[0] = _this.state.data[0].Options[0]
          _this.state.formData2[1] = _this.state.data[0].Options[1]
          _this.state.formData2[2] = _this.state.data[0].Options[2]
          _this.state.formData2[3] = _this.state.data[0].Options[3]
        })
    })
  }

  handleSubmit (event) {
    event.preventDefault();
    var _this = this
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      
      console.log("HERE")
      fetch('http://localhost:8800/delquestion/'+_this.state.data[_this.state.cur].Question.id+'/', {
          method: 'GET',
          headers: new Headers({
            'authtok':idToken
          }),
        })
      .then(jsr => {
        console.log("del sent")
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
    })
  }


  handleqtextChange(event) {
      this.state.formData1.qtext = event.target.value;
      this.state.data[this.state.cur].Question.qtext = event.target.value;
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

  nextQuestion(){
    var p = this.state.cur
    p+=1
    if(p < this.state.data.length){
      this.setState({cur:p})
      this.state.formData1 = this.state.data[p].Question
      this.state.formData2[0] = this.state.data[p].Options[0]
      this.state.formData2[1] = this.state.data[p].Options[1]
      this.state.formData2[2] = this.state.data[p].Options[2]
      this.state.formData2[3] = this.state.data[p].Options[3]
    }
  }

  render() {
    var _this = this

    if (this.state.data && this.state.data.length>0) {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Edit Questions</h1>
          </header>
          <br/><br/>
          <input type='button' value='Next' onClick={_this.nextQuestion.bind(_this)} /> 
          <div className="formContainer">
            <form onSubmit={_this.handleSubmit}>
              <div className="form-group">
                  <label>Question Text</label>
                  <input type="text" className="form-control"key={this.state.cur} defaultValue={_this.state.data[_this.state.cur].Question.qtext} onChange={_this.handleqtextChange}/>
              </div>
              <div className="form-group">
                  <label>Multiple correct?
                  <input type="checkbox" className="form-control" key={this.state.cur} defaultChecked={_this.state.data[_this.state.cur].Question.qtype==2} onChange={_this.handleqtypeChange}/>
                  </label>
              </div>
              <div className="form-group">
                  <label>Option 1</label>
                  <input type="text" className="form-control" key={this.state.cur} defaultValue={_this.state.data[_this.state.cur].Options[0].otext} onChange={_this.handleotextChange} id ='0'/>
                  <label>correct</label>
                  <input type="checkbox" className="form-control" key={this.state.cur + 1} defaultChecked={_this.state.data[_this.state.cur].Options[0].correct=='true'} onChange={_this.handlecorrectChange} id ='0'/>
              </div>
              <div className="form-group">
                  <label>Option 2</label>
                  <input type="text" className="form-control" key={this.state.cur} defaultValue={_this.state.data[_this.state.cur].Options[1].otext} onChange={_this.handleotextChange} id ='1'/>
                  <label>correct</label>
                  <input type="checkbox" className="form-control" key={this.state.cur + 1} defaultChecked={_this.state.data[_this.state.cur].Options[1].correct=='true'} onChange={_this.handlecorrectChange} id ='1'/>
              </div>
              <div className="form-group">
                  <label>Option 3</label>
                  <input type="text" className="form-control" key={this.state.cur} defaultValue={_this.state.data[_this.state.cur].Options[2].otext} onChange={_this.handleotextChange} id ='2'/>
                  <label>correct</label>
                  <input type="checkbox" className="form-control" key={this.state.cur + 1} defaultChecked={_this.state.data[_this.state.cur].Options[2].correct=='true'} onChange={_this.handlecorrectChange} id ='2'/>
              </div>
              <div className="form-group">
                  <label>Option 4</label>
                  <input type="text" className="form-control" key={this.state.cur} defaultValue={_this.state.data[_this.state.cur].Options[3].otext} onChange={_this.handleotextChange} id ='3'/>
                  <label>correct</label>
                  <input type="checkbox" className="form-control" key={this.state.cur + 1} defaultChecked={_this.state.data[_this.state.cur].Options[3].correct=='true'} onChange={_this.handlecorrectChange} id ='3'/>
              </div>


                  <button type="submit" className="btn btn-default">Submit</button>
            </form>
          </div>

          {_this.state.submitted &&
            <div>
              <h2>
                Question successfully edited.
              </h2>
            </div>
          }
        </div>
      );
    }
    else{
      return (
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Wait</h1>
            </header>
            <h1> Loading </h1>
          </div>
        );
    } 
  }
}

export default EditQuestion;
