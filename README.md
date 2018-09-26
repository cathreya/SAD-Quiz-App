# SAD Quiz App

## Introduction
A simple quiz application writen using a Go (Gonic Gin) backend and a ReactJS frontend.

#### Some features
 - Login with your email or your Google/Github
 - Answer MCQ Single and Multiple Correct questions
 - Answer Image and Audio based questions
 - View Overall and Genre-wise leaderboard
 - View all your attempted quizes
 - Stuck? Use a lifeline! Confident? Use a powerup!
 - Admin panel to Modify quizes, questions and options
	

## To Run
Install the frontend dependecies with 
```
cd react-app/
yarn
```

Install the backend dependencies with 
```
cd go/src/SSADQuiz/
go get
```

Run the frontend with 
```
cd react-app/
yarn start
```

Run the backend with
```
cd go/src/SSADQuiz/
go run main.go
```

## Go Packages Used
 - "fmt"
 - "github.com/gin-contrib/cors"
 - "github.com/gin-gonic/gin"
 - "github.com/jinzhu/gorm"
 - _ "github.com/jinzhu/gorm/dialects/sqlite"
 - "strconv"
 - "golang.org/x/net/context"
 - firebase "firebase.google.com/go"
 - "strings"
 - "log"  
 - "google.golang.org/api/option"
 - "google.golang.org/api/iterator"

## Directory Structure
```
.
├── go
│   ├── bin
│   ├── pkg
│   └── src
│       └── SSADQuiz
│           ├── gorm.db
│           ├── main.go
├── react-app
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── manifest.json
│   ├── README.md
│   ├── src
│   │   ├── addQuestions.jsx
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── createQuestions.jsx
│   │   ├── createQuiz.jsx
│   │   ├── deleteQuiz.jsx
│   │   ├── editquestions.jsx
│   │   ├── home.css
│   │   ├── home.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── leaderboard.jsx
│   │   ├── logo.svg
│   │   ├── logout.jsx
│   │   ├── NewComponent.js
│   │   ├── newQuiz.css
│   │   ├── quizes.css
│   │   ├── quizes.jsx
│   │   ├── quiz.jsx
│   │   ├── registerServiceWorker.js
│   │   ├── test.cpp
│   │   └── viewallusers.jsx
│   └── yarn.lock
└── README.md
```