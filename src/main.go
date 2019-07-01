package main

import (
	//"fmt"
	"net/http"
	"os"
	"html/template"
	"log"
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
	http.HandleFunc("/", indexHandler)
	
	porta := os.Getenv("PORT")
	if porta == "" {
		porta = "5000"
	}
	http.ListenAndServe(":" + porta, nil)
}