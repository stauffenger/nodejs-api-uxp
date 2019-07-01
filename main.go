package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"html/template"
	"log"
	"strconv"	
	_ "github.com/lib/pq"
)

type projeto struct{
	Nome string
	Descricao string
}

func indexHandler(w http.ResponseWriter, r *http.Request)  {
	projetos := projeto{Nome: "Projeto Zeta", Descricao: "apenas um teste."}
	templateIndex, err := template.ParseFiles("./public/index.html")
	if err != nil {
		log.Print("template parsing error: ", err)
	}

	err = templateIndex.Execute(w, projetos)
	if err != nil {
			log.Print("template executing error: ", err)
	}
}

func main()  {

	userPostgre := os.Getenv("USER_POSTGRE")
	databasePostgre := os.Getenv("DATABASE_POSTGRE")
	passwordPostgre := os.Getenv("PASSWORD_POSTGRE")
	portPostgre, _ := strconv.ParseInt(os.Getenv("PORT_POSTGRE"), 10, 64)
	hostPostgre := os.Getenv("HOST_POSTGRE")

	log.Print(">>>>>>>>>>>> ", portPostgre)

	loginPostgreSQL := fmt.Sprintf("host=%s port=%d user=%s "+
    "password=%s dbname=%s sslmode=disable",
	hostPostgre, portPostgre, userPostgre, passwordPostgre, databasePostgre)
	
	db, err := sql.Open("postgres", loginPostgreSQL)
	if err != nil {
		panic(err)
	}
	defer db.Close()	

	err = db.Ping()
	if err != nil {
	  panic(err)
	}

	sqlStatement := `SELECT senha = crypt('chiclete', senha), login FROM usuarios where login = $1`
	var senha bool
	var login string
	row := db.QueryRow(sqlStatement, "lucaspascoal")
	switch err := row.Scan(&senha, &login); err {
	case sql.ErrNoRows:
		fmt.Println("No rows were returned!")
	case nil:
		fmt.Println(senha, login)
	default:
		panic(err)
	}

	http.HandleFunc("/", indexHandler)
	
	porta := os.Getenv("PORT")
	if porta == "" {
		porta = "5000"
	}
	http.ListenAndServe(":" + porta, nil)
}