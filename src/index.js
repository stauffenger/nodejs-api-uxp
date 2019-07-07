const clientBancoDeDados = require('./acesso_ao_banco')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

app.get('/', indexHandler)
app.get('/projetos', projetosHandler)
app.get('/login', loginHandler)

app.listen(PORT)

function indexHandler(request, response) {
    response.send("Bem-vindo a API do site UXP!")
}

function projetosHandler(request, response) {
    clientBancoDeDados.getProjetos(request, response)
}

function loginHandler(request, response) {
    clientBancoDeDados.login(request, response)
}