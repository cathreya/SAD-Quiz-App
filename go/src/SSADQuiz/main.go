package main

import (
	"fmt"
	"github.com/gin-contrib/cors"                        // Why do we need this package?
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"           // If you want to use mysql or any other db, replace this line
	"strconv"

  "golang.org/x/net/context"

  firebase "firebase.google.com/go"
  // "firebase.google.com/go/auth"
  "strings"
  "log"  
  "google.golang.org/api/option"
  "google.golang.org/api/iterator"
)

var db *gorm.DB                                         // declaring the db globally
var err error

type Quiz struct{
	Id uint `json:"id"`
	Qname string `json:"qname"`
	Genre string `json:"genre"`
}

type Questions struct{ 
	Id uint `json:"id,string"`
	Quizid uint `json:"quizid,string" sql:"type:bigint REFERENCES quizzes(id) ON DELETE CASCADE ON UPDATE CASCADE"`
	Qtext string `json:"qtext"`
	Qtype uint `json:"qtype,string"`
}

type Options struct{ 
	Id uint `json:"id,string"`
	Qid uint `json:"qid,string" sql:"type:bigint REFERENCES questions(id) ON DELETE CASCADE ON UPDATE CASCADE"`
	Otext string `json:"otext"`
	Correct bool `json:"correct,string"`
}

type Leaderboard struct{
	User string `json:"user"`
	Quizid uint `json:"quizid,string" sql:"type:bigint REFERENCES quizzes(id) ON DELETE CASCADE ON UPDATE CASCADE"`
	Genre string `json:"genre"`
	Score uint `json:"score,string"`
}

var app *firebase.App


func verify(idToken string, ctx context.Context) bool{
	client, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}
	token, err := client.VerifyIDToken(ctx, idToken)

	if err != nil {
		if strings.Contains(err.Error(), "timestamp"){

		} else{
			fmt.Println(err)
			return false
		}
	}
	log.Printf("Verified ID token: %v\n", token)
	return true
}



func main() {

	opt := option.WithCredentialsFile("./ssadproject-99142-firebase-adminsdk-cn9nt-111e01a2ee.json")
	app, err = firebase.NewApp(context.Background(), nil, opt)
	// if err != nil {
	//   return nil, fmt.Errorf("error initializing app: %v", err)
	// }


	db, err = gorm.Open("sqlite3", "./gorm.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

   db.Exec("PRAGMA foreign_keys = ON")
 	db.LogMode(true)


	db.AutoMigrate(&Quiz{})
	db.AutoMigrate(&Questions{})
	db.AutoMigrate(&Options{})
	db.AutoMigrate(&Leaderboard{})
	
	// db.Create(Quiz{2,"Shit quiz bro","not so random"})
	// db.Create(Questions{1,1,"whos yo daddy",1})
	// db.Create(Questions{2,1,"what is 2 +2",1})
	// db.Create(Questions{3,1,"who is dumb as bricks",2})
	// db.Create(Options{Id:9,Qid:3,Otext:"yo momma",Correct:true})
	// db.Create(Options{Id:10,Qid:3,Otext:"yo brodda",Correct:false})
	// db.Create(Options{Id:11,Qid:3,Otext:"yo face",Correct:true})
	// db.Create(Options{Id:12,Qid:3,Otext:"yo daddey",Correct:true})

	// db.Create(Options{Id:5,Qid:2,Otext:"2",Correct:true})
	// db.Create(Options{Id:6,Qid:2,Otext:"3",Correct:false})
	// db.Create(Options{Id:7,Qid:2,Otext:"5",Correct:false})
	// db.Create(Options{Id:8,Qid:2,Otext:"6",Correct:false})


	r := gin.Default()
	r.GET("/quizes/", GetQuizes)                             // Creating routes for each functionality
	r.GET("/quiz/:id/", GetQuiz)
	r.GET("/deletequiz/:qid/",DelQuiz)
	r.POST("/newquiz/",CreateQuiz)
	r.POST("/newquestion/",CreateQuestion)
	r.POST("/newoptions/",CreateOptions)
	r.GET("/tokentest/", tokenTest)
	r.GET("/getleader/", GetLeaderboard)
	r.GET("/getleader/:genre/", GetLeaderboard2)
	r.GET("/myscores/:me/", GetMyScores)
	r.GET("/ViewAllUsers/",ViewAllUsers)
	r.GET("/delquestion/:qid/",DelQuestion)
	r.POST("/addleader/", AddtoLeaderboad)

	r.Use(cors.New(cors.Config{
		AllowMethods:     []string{"GET", "POST", "OPTIONS", "PUT"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "User-Agent", "Referrer", "Host", "Token", "authtok"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowAllOrigins:  false,
		AllowOriginFunc:  func(origin string) bool { return true },
		MaxAge:           86400,
	}))
	r.Run(":8800")                                           // Run on port 8080
}


func ViewAllUsers(c *gin.Context){
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
	type Users struct{
		DisplayName string `json:"name"`
		Email string `json:"email"`
	}
	var u []Users
	// Note, behind the scenes, the Users() iterator will retrive 1000 Users at a time through the API
	client, _ := app.Auth(context.Background())
	iter := client.Users(context.Background(), "")
	for {
     user, err := iter.Next()
     if err == iterator.Done {
             break
     }
     if err != nil {
             log.Fatalf("error listing users: %s\n", err)
     }
     fmt.Printf("read user user: %v\n", user.DisplayName)
     u = append(u,Users{user.DisplayName, user.Email})

	}
	c.Header("access-control-allow-origin", "*")
   c.JSON(200, u)	
}

func DelQuiz(c *gin.Context){
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
	fmt.Println("HERE")
   id := c.Params.ByName("qid")
   fmt.Println("HERE", id)
   
   var quiz Quiz
   db.Where("id = ?", id).Delete(&quiz)

   c.Header("access-control-allow-origin", "*")
   c.JSON(200, gin.H{"id #" + id: "deleted"})
}

func DelQuestion(c *gin.Context){
   tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}

   id := c.Params.ByName("qid")
   fmt.Println("HERE", id)
   
   var question Questions
   db.Where("id = ?", id).Delete(&question)

   c.Header("access-control-allow-origin", "*")
   c.JSON(200, gin.H{"id #" + id: "deleted"})
	
}

func tokenTest(c *gin.Context){
	tok2 := c.Request.Header.Get("authtok")
	fmt.Println("Here")
	// fmt.Println(tok2)
	verify(tok2, context.Background())
	c.Writer.Header().Set("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, "")		
}

func GetQuizes(c *gin.Context){
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
	var Quizes []Quiz
	if err := db.Find(&Quizes).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println("Damm man wtf")
		fmt.Println(err)
	}	else{
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, Quizes)	
	}
}



func CreateQuiz(c *gin.Context) {
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
   var quiz Quiz
   c.BindJSON(&quiz)
   // fmt.Println(quiz)
   db.Create(&quiz)
   c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
   c.JSON(200, quiz)
}

func CreateQuestion(c *gin.Context) {
	tok2 := c.Request.Header.Get("authtok")
	// fmt.Println(tok2)
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
   var kostin Questions
   c.BindJSON(&kostin)
   // fmt.Println(kostin)
   if dbc := db.Create(&kostin); dbc.Error != nil{
   	fmt.Println("WE ARE herE")
	   c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	   c.JSON(400, kostin)
   } else {
   	db.First(&kostin)
   	// fmt.Println(kostin)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, kostin)
   	
   }
}

func CreateOptions(c *gin.Context) {
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
   var options []Options
   c.BindJSON(&options)
   // fmt.Println(options)
	
	for _, option := range options {
		db.Create(&option)
	}

   c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
   c.JSON(200, options)
}



func GetQuiz(c *gin.Context){
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
	type Return struct{
		Question Questions
		Options []Options		
	}

	var ret []Return

	var Qs []Questions

	id,_ := strconv.ParseUint(c.Param("id"),10,64)
	qid := uint(id)

	if err := db.Where(&Questions{Quizid:qid}).Find(&Qs).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println("Damm man wtf")
		fmt.Println(err)
	}	

	for _, question := range Qs {
		var Opts []Options
		db.Where(&Options{Qid:question.Id}).Find(&Opts)
		// fmt.Println(Opts)
		ret = append(ret,Return{Question:question, Options:Opts})
	}
	// fmt.Println(ret)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, ret)	



}


func AddtoLeaderboad(c *gin.Context){
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
	var entry Leaderboard
	c.BindJSON(&entry)
	var quiz Quiz
	db.Where(Quiz{Id:entry.Quizid}).First(&quiz)

	// fmt.Println(entry,quiz)

	db.Where(Leaderboard{User: entry.User, Genre: quiz.Genre, Quizid: entry.Quizid}).Assign(Leaderboard{Score: entry.Score}).FirstOrCreate(&entry)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, entry)		
}


func GetLeaderboard(c *gin.Context){
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
	type Result struct{
		User string `json:"user"`
		Score uint `json:"score"`
	}
	var results []Result
	db.Table("leaderboards").Select("user, sum(score) as score").Group("user").Order("score desc").Scan(&results)
	// fmt.Println(results)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, results)		

}

func GetLeaderboard2(c *gin.Context){
	fmt.Println("HERE")
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}
	type Result struct{
		User string `json:"user"`
		Score uint `json:"score"`
	}
	var results []Result
	db.Table("leaderboards").Select("user, sum(score) as score").Where("genre = ?",c.Param("genre")).Group("user").Order("score desc").Scan(&results)
	// fmt.Println(results)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, results)		

}

func GetMyScores(c *gin.Context){
	fmt.Println("HERE")
	tok2 := c.Request.Header.Get("authtok")
	valid := verify(tok2, context.Background())
	if(!valid){
		c.AbortWithStatus(401)
		return
	}

	uname := c.Param("me")

	type Result struct{
		Qname string `json:"qname"`
		Score uint `json:"score"`
	}	
	var results []Result

	db.Table("leaderboards").Select("quizzes.qname, leaderboards.score").Joins("join quizzes on quizzes.id = leaderboards.quizid").Where("leaderboards.user =?",uname).Scan(&results)
	// fmt.Println(results)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, results)		

}