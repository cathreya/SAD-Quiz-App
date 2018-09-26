import React, { Component } from 'react';
import Home from './home';
import Logout from './logout'
import Quizes from './quizes'
import Quiz from './quiz'
import NewQuiz from './createQuiz'
import NewQuestion from './createQuestions'
import QuizesAdd from './addQuestions'
import Leaderboard from './leaderboard'
import DeleteQuiz from './deleteQuiz'
import ViewAllUsers from './viewallusers'
import EditQuestion from './editquestions'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';




// Import FirebaseAuth and firebase.
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

// Configure Firebase.
var config = {
    apiKey: "AIzaSyC8iOw9hWZjdw6HVHacJPZn20e6oVZM9bs",
    authDomain: "ssadproject-99142.firebaseapp.com",
    databaseURL: "https://ssadproject-99142.firebaseio.com",
    projectId: "ssadproject-99142",
    storageBucket: "ssadproject-99142.appspot.com",
    messagingSenderId: "173849883572"
  };

firebase.initializeApp(config);


class App extends Component {

  // The component's Local state.
  state = {
    isSignedIn: false, // Local signed-in state.
    isAdmin: false
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => {
          this.setState({isSignedIn: !!user})
          this.setState({isAdmin:firebase.auth().currentUser.email == 'admin@admin.com'})
        }
    );
  }
  
  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1>SAD Quiz App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
    else {      
      var _this = this
      return (
        <div>
          <Router>
            <div>
              <nav className="navbar navbar-default">
                <div className="container-fluid">
                  <div className="navbar-header">
                    <Link className="navbar-brand" to={'/'}>SAD Quiz App</Link>
                  </div>
                  <ul className="nav navbar-nav">
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/Quizes'}>Quizes</Link></li>
                    <li><Link to={'/Leaderboard'}>Leaderboard</Link></li>

                    {_this.state.isAdmin &&
                      <li><Link to={'/NewQuiz'}>Create Quiz</Link></li>
                    }
                    {_this.state.isAdmin &&
                      <li><Link to={'/AddQuestions'}>Edit/Delete Quiz</Link></li>
                    }
                    {_this.state.isAdmin &&
                      <li><Link to={'/ViewUsers'}>View All Users</Link></li>
                    }
                    <li><Link to={'/logout'}>{firebase.auth().currentUser.displayName}</Link></li>
                  </ul>
                </div>
              </nav>
              <Switch>
                   <Route exact path='/' component={Home} />
                   <Route exact path='/Quizes' component={Quizes} />
                   <Route path='/Quiz/:id' component={Quiz} />
                   <Route path='/NewQuiz' component={NewQuiz} />
                   <Route path='/NewQuestions/:qid' component={NewQuestion} />
                   <Route path='/DeleteQuiz/:qid' component={DeleteQuiz} />
                   <Route path='/AddQuestions' component={QuizesAdd} />
                   <Route path='/Leaderboard' component={Leaderboard} />
                   <Route path='/ViewUsers' component={ViewAllUsers} />
                   <Route path='/EditQuestions/:qid' component={EditQuestion} />
                   <Route path='/logout' component={Logout} />
              </Switch>
            </div>
          </Router>
        </div>
      );
    }
  }
}

export default App;
