const clientBancoDeDados = require('./acesso_ao_banco')
const jsonwebtoken = require('jsonwebtoken')
const express = require('express')
const app = express()
const SENHA_JWT = process.env.SENHA_JWT
const PORTA = process.env.PORT || 5000

app.get('/', indexHandler)
app.get('/projetos', projetosHandler)
app.post('/projetos/inserir', projetosInserirHandler)
app.post('/projetos/deletar', projetosDeletarHandler)
app.post('/projetos/editar', projetosEditarHandler)
app.post('/login', loginHandler)
app.post('/cadastro/inserir', cadastroInserirHandler)
app.post('/cadastro/deletar', cadastroDeletarHandler)
app.post('/cadastro/editar', cadastroEditarHandler)

app.listen(PORTA)

function autorizacao(request, response) {
    /*let token = request.headers['Token']
    if (token !== undefined) {
    jsonwebtoken.verify(token, SENHA_JWT)
    .then(true)
    .cath(erro => console.error("Falha na autenticação.", erro))
    }
    response.send("Acesso não autorizado. Você não deveria estar aqui!")
    return false*/
    return true
}

function indexHandler(request, response) {
    if (autorizacao(request, response)) {
        response.send("Bem-vindo a API do site UXP!")
    }
}

function projetosHandler(request, response) {
    if (autorizacao(request, response)) {
        clientBancoDeDados.getProjetos(request, response)
    }
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
        clientBancoDeDados.login(request, response)
    }
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