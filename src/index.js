const clientBancoDeDados = require('./acesso_ao_banco')
const logs = require('./routes/logs')
const express = require('express')
const app = express()
const cors = require('cors')
const jose = require('node-jose');
const KEY_JWE = process.env.KEY_JWE
const PORTA = process.env.PORT || 5000

app.use(cors())
app.use(express.json()) // Transforma o JSON do body em um objeto JavaScript

app.get('/', indexHandler)

app.get('/projetos', projetosHandler)
app.post('/projetos/inserir', projetosInserirHandler)
app.post('/projetos/deletar', projetosDeletarHandler)
app.post('/projetos/editar', projetosEditarHandler)

app.post('/login', loginHandler)
app.post('/logout', logoutHandler)

app.get('/cadastro', cadastroHandler)
app.post('/cadastro/inserir', cadastroInserirHandler)
app.post('/cadastro/deletar', cadastroDeletarHandler)
app.post('/cadastro/editar', cadastroEditarHandler)

app.post('/logs', logsHandler)

app.listen(PORTA)

function indexHandler(request, response) {
    response.send("Bem-vindo a API do site UXP!")
}

function projetosHandler(request, response) {
    clientBancoDeDados.getProjetos(request, response)
}

function projetosInserirHandler(request, response) {
    clientBancoDeDados.inserirProjeto(request, response)
}

function projetosDeletarHandler(request, response) {
    clientBancoDeDados.deletarProjeto(request, response)
}

function projetosEditarHandler(request, response) {
    clientBancoDeDados.editarProjeto(request, response)
}

function loginHandler(request, response) {
    clientBancoDeDados.login(request, response)
}

function logoutHandler(request, response) {
    clientBancoDeDados.logout(request, response)
}

function cadastroHandler(request, response) {
    clientBancoDeDados.getCadastro(request, response)
}

function cadastroInserirHandler(request, response) {
    clientBancoDeDados.inserirCadastro(request, response)
}

function cadastroDeletarHandler(request, response) {
    clientBancoDeDados.deletarCadastro(request, response)
}

function cadastroEditarHandler(request, response) {
    clientBancoDeDados.editarCadastro(request, response)
}

function logsHandler(request, response) {
    logs.getLogs(request, response)
}