import React, { Component } from 'react';
import './quizes.css';
import firebase from 'firebase';
import ReactAudioPlayer from 'react-audio-player';

class Quizes extends Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      qid:  props.match.params.id,
      curQuestion: 0,
      score: 0,
      selected: [false,false,false,false],
      answered:false,
      finished:false,
      image:"",
      audio:"",
      doublePowerup:2, //2 available 1 activate 0 used
      removeOneWrong:2 //2 available 1 activate 0 used
    }
    this.checkAnswer = this.checkAnswer.bind(this)
    this.nextQuestion = this.nextQuestion.bind(this)
    this.checkMultiAnswer = this.checkMultiAnswer.bind(this)
    this.checkMultiAnswer = this.checkMultiAnswer.bind(this)
    this.updateCheck = this.updateCheck.bind(this)
    this.doublePowerup = this.doublePowerup.bind(this)
    this.removeOneWrong = this.removeOneWrong.bind(this)
    this.fetchImg = this.fetchImg.bind(this)
    this.fetchAud = this.fetchAud.bind(this)
  }

  checkAnswer(ansid){
  	var ans  = this.state.data[this.state.curQuestion].Options[ansid].correct
	// console.log(ansid,ans,this.state.answered)
  	if (ans=='true' && !this.state.answered){
  		console.log("HERETOO")
  		var k = this.state.score
  		if(this.state.doublePowerup === 1){
	  		k+=1
	  		this.setState({doublePowerup:0})
  		}
  		k+=1
		this.setState({score:k})
  	}
  	this.setState({answered:true})
  }

  checkMultiAnswer(){
  	if(this.state.answered){
  		return
  	}
  	var f = true
  	for (var i = 0; i < this.state.selected.length; i++) {
		console.log(i, this.state.selected[i],((this.state.data[this.state.curQuestion].Options[i].correct)==='true'))
  		if(this.state.selected[i] !== ((this.state.data[this.state.curQuestion].Options[i].correct)==='true')){

  			f = false
  			break
  		}
  	}
  	if(f){
		var k = this.state.score
		if(this.state.doublePowerup === 1){
	  		k+=1
	  		this.setState({doublePowerup:0})
  		}
  		k+=1
		this.setState({score:k})	
  	}
  	this.setState({answered:true})
  }

  updateCheck(ansid){
  	var k  = this.state.selected;
  	k[ansid]=!k[ansid]
  	this.setState({selected:k})
  }

  nextQuestion(){
  	var p = this.state.curQuestion
	p+=1
	if(p < this.state.data.length){
		this.state.data[p].Question.qtext = this.fetchImg(this.state.data[p].Question.qtext)
		this.state.data[p].Question.qtext = this.fetchAud(this.state.data[p].Question.qtext)
		this.setState({curQuestion:p, answered:false})
	}
	else{
		this.setState({finished:true})
		var _this  = this
		var bod = {"user":firebase.auth().currentUser.displayName, "score":String(this.state.score), "quizid":this.state.qid, "genre":""}
		console.log(JSON.stringify(bod))
	    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
	      console.log(idToken)
	      fetch('http://127.0.0.1:8800/addleader/', {
	        method: 'POST',
	        headers: new Headers({
	          'authtok':idToken
	        }),
	        body: JSON.stringify(bod)
	      })
	    })	
	}
  }

  doublePowerup(){
  	this.setState({doublePowerup:1})
  }

  removeOneWrong(){
  	this.setState({removeOneWrong:0})
  	for (var i = 0; i < this.state.data[this.state.curQuestion].Options.length; i++) {
  		if(this.state.data[this.state.curQuestion].Options[i].correct == "false"){
  			console.log("arre yaar")
  			this.state.data[this.state.curQuestion].Options[i].otext = "Removed"
  			break
  		}
  	}
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
        .then(data => _this.setState({data: data}) )
         .then(noth => {
         	_this.state.data[_this.state.curQuestion].Question.qtext = _this.fetchImg(_this.state.data[_this.state.curQuestion].Question.qtext)
         	_this.state.data[_this.state.curQuestion].Question.qtext = _this.fetchAud(_this.state.data[_this.state.curQuestion].Question.qtext)
         })
    })
  }

  fetchImg(str){
  	var t = str.indexOf("*img*")
  	if(t == -1){
	  	this.setState({image:""})
  		console.log(str)
  		return str
  	}
  	var td = str.indexOf("*/img*")
  	var ret = str.substring(t+5,td)
  	this.setState({image:ret})
  	return str.replace(str.substring(t,td+6),'')
  }

  fetchAud(str){
  	var t = str.indexOf("*aud*")
  	if(t == -1){
  		console.log(str)
	  	this.setState({audio:""})
  		return str
  	}
  	var td = str.indexOf("*/aud*")
  	var ret = str.substring(t+5,td)
  	this.setState({audio:ret})
  	return str.replace(str.substring(t,td+6),'')
  }



  render() {
  	// console.log(this.state.data[this.state.curQuestion].keys(Options))
  	var _this = this
  	var isAudio = this.state.audio == "";
  	isAudio = !isAudio
  	console.log(isAudio)
  	if(this.state.finished){
  		return (
		      <div className="App">
		        <header className="App-header">
		          <h1 className="App-title">Quiz {this.state.qid}</h1>
		        </header>
			    <h1> 
	        		Complete!
		        </h1>
	          <h3> Final Score: {this.state.score} </h3>
	          </div>
	    );
  	}
  	else if (this.state.data && this.state.data.length>0) {
  		if(this.state.data[this.state.curQuestion].Question.qtype == 2){
  			console.log("Yahan")
			return (
		      <div className="App">
		        <header className="App-header">
		          <h1 className="App-title">Quiz {this.state.qid}</h1>
		        </header>
			    <h1>Q 		  
	        	{String(_this.state.curQuestion+1)+": "} 
		        {_this.state.data[_this.state.curQuestion].Question.qtext}
		        </h1>
		        <img src={_this.state.image}></img>
		        {isAudio &&
			        <ReactAudioPlayer 
			        	src = {_this.state.audio}
						controls
			        />
			    }

	          <h3> Score: {this.state.score} </h3>
	          { _this.state.answered && 
	          	<input type='button' value='Next' onClick={this.nextQuestion.bind(this)} /> 
	          }
	          {_this.state.doublePowerup === 2 &&
	          	<input type='button' value='Double Points' onClick={this.doublePowerup} /> 
	          }
	          {_this.state.removeOneWrong === 2 &&
	          	<input type='button' value='Remove one wrong option' onClick={this.removeOneWrong} /> 
	          }

	            <table className="table-hover">
	            <tbody>
		        	<tr> 
		        		<td className={_this.state.answered ? 'opt'+_this.state.data[_this.state.curQuestion].Options[0].correct : undefined}><label><input type="checkbox" 
		        		onClick = {this.updateCheck.bind(this,0)}/>{_this.state.data[_this.state.curQuestion].Options[0].otext}</label>
			        	</td>
			        	<td className={_this.state.answered ? 'opt'+_this.state.data[_this.state.curQuestion].Options[1].correct : undefined}><label><input type="checkbox" 
			        	onClick = {this.updateCheck.bind(this,1)}/>{_this.state.data[_this.state.curQuestion].Options[1].otext}</label>
			        	</td>
			        </tr>
			        <tr> 
		        		<td className={_this.state.answered ? 'opt'+_this.state.data[_this.state.curQuestion].Options[2].correct : undefined}><label><input type="checkbox" 
		        		onClick = {this.updateCheck.bind(this,2)}/>{_this.state.data[_this.state.curQuestion].Options[2].otext}</label>
			        	</td>
			        	<td className={_this.state.answered ? 'opt'+_this.state.data[_this.state.curQuestion].Options[3].correct : undefined}><label><input type="checkbox" 
			        	onClick = {this.updateCheck.bind(this,3)}/>{_this.state.data[_this.state.curQuestion].Options[3].otext}</label>
			        	</td>
			        </tr>
			    </tbody>
			    </table>
			    <input type='submit' onClick={this.checkMultiAnswer} />
		      </div>
		    );  			
  		}
  		else{
  			console.log("HERE")
		    return (
		      <div className="App">
		        <header className="App-header">
		          <h1 className="App-title">Quiz {this.state.qid}</h1>
		        </header>
		        <h1>
			    {String(_this.state.curQuestion+1)+": "} 
		        {_this.state.data[_this.state.curQuestion].Question.qtext}
		        </h1>
		        <img src={this.state.image}></img>
		        {isAudio &&
			        <ReactAudioPlayer 
			        	src = {_this.state.audio}
						controls
			        />
			    }
	          <h3> Score: {this.state.score} </h3>
	          { _this.state.answered && 
	          	<input type='button' value='Next' onClick={this.nextQuestion.bind(this)} /> 
	          }
	          {_this.state.doublePowerup === 2 &&
	          	<input type='button' value='Double Points' onClick={this.doublePowerup} /> 
	          }
	          {_this.state.removeOneWrong === 2 &&
	          	<input type='button' value='Remove one wrong option' onClick={this.removeOneWrong} /> 
	          }
	            <table className="table-hover">
	            <tbody>
		        	<tr> 
		        		<td className={_this.state.answered ? 'opt'+_this.state.data[_this.state.curQuestion].Options[0].correct : undefined}><input type="button" 
		        					value={_this.state.data[_this.state.curQuestion].Options[0].otext}
		        					onClick={_this.checkAnswer.bind(this,0)} />
			        	</td>
			        	<td className={_this.state.answered ? 'opt'+_this.state.data[_this.state.curQuestion].Options[1].correct : undefined}><input type="button" 
			        				value={_this.state.data[_this.state.curQuestion].Options[1].otext}
			        				onClick={_this.checkAnswer.bind(this,1)} />
			        	</td>
			        </tr>
			        <tr> 
		        		<td className={_this.state.answered ? 'opt'+_this.state.data[_this.state.curQuestion].Options[2].correct : undefined}><input type="button" 
		        					value={_this.state.data[_this.state.curQuestion].Options[2].otext}
		        					onClick={_this.checkAnswer.bind(this,2)} />
			        	</td>
			        	<td className={_this.state.answered ? 'opt'+_this.state.data[_this.state.curQuestion].Options[3].correct : undefined}><input type="button" 
			        				value={_this.state.data[_this.state.curQuestion].Options[3].otext}
			        				onClick={_this.checkAnswer.bind(this,3)} />
			        	</td>
			        </tr>
			    </tbody>
			    </table>
		      </div>
		    );
		}
	} else{
		return (
	      <div className="App">
	        <header className="App-header">
	          <h1 className="App-title">Quiz {this.state.qid}</h1>
	        </header>
	        <h1> No Questions Yet :C </h1>
	      </div>
	    );
	}	
  }
}

export default Quizes;
