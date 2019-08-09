const clientBancoDeDados = require('./acesso_ao_banco')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const jose = require('node-jose');
const KEY_JWE = process.env.KEY_JWE
const PORTA = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

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

app.listen(PORTA)

function autorizacao(request, response) {
    /*let token = request.body.jwt
    if(token !== undefined){
        jose.JWE.createDecrypt(KEY_JWE)
        .decrypt(token)
        .then((resultado) => {
            request.body.jwt = JSON.parse(resultado.payload)
        })
        .then(true)
        .catch(erro => console.error("Erro ao descriptografar conteúdo do JWT", erro))
    }
    response.send("Acesso não autorizado. Você não deveria estar aqui!")
    return false*/
    return true
}

function indexHandler(request, response) {
    response.send("Bem-vindo a API do site UXP!")
}

function projetosHandler(request, response) {
    clientBancoDeDados.getProjetos(request, response)
}

function projetosInserirHandler(request, response) {
    if (autorizacao(request, response)) {
        clientBancoDeDados.inserirProjeto(request, response)
    }
}

function projetosDeletarHandler(request, response) {
    if (autorizacao(request, response)) {
        clientBancoDeDados.deletarProjeto(request, response)
    }
}

function projetosEditarHandler(request, response) {
    if (autorizacao(request, response)) {
        clientBancoDeDados.editarProjeto(request, response)
    }
}

function loginHandler(request, response) {
    if (autorizacao(request, response)) {
        //response.json(request.body.jwt)
        clientBancoDeDados.login(request, response)
    }
}

function logoutHandler(request, response) {
    if (autorizacao(request, response)) {
        clientBancoDeDados.logout(request, response)
    }
}

function cadastroHandler(request, response) {
    clientBancoDeDados.getCadastro(request, response)
}

function cadastroInserirHandler(request, response) {
    if (autorizacao(request, response)) {
        clientBancoDeDados.inserirCadastro(request, response)
    }
}

function cadastroDeletarHandler(request, response) {
    if (autorizacao(request, response)) {
        clientBancoDeDados.deletarCadastro(request, response)
    }
}

function cadastroEditarHandler(request, response) {
    if (autorizacao(request, response)) {
        clientBancoDeDados.editarCadastro(request, response)
    }
}