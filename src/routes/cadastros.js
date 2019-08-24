const express = require('express')
const router = express.Router()

const logs = require('./logs')
const bancoDeDados = require('../acesso_ao_banco')

router.get('/:usuario', (request, response, next) => {
    let clientBancoDeDados = bancoDeDados.novoClient()
    let usuario = request.params.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("SELECT usuario, status FROM usuarios WHERE usuario = $1", [usuario]))
    .then(resultado => {
        if (resultado.rows[0] === undefined) {
            response.json({ "usuario" : false })
        } else {
            response.json(resultado.rows[0])
        }
    })
    .catch(erro => console.error("Erro ao tentar conectar com o banco de dados.", erro))
    .finally(() => clientBancoDeDados.end())
})

router.post('/', (request, response, next) => {
    let clientBancoDeDados = bancoDeDados.novoClient()
    let senha = request.body.senha
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(async () => {
        await clientBancoDeDados.query("INSERT INTO usuarios(usuario, senha) VALUES($1, crypt($2, gen_salt('bf')))", [usuario, senha])
        .catch(erro =>console.error("Erro ao tentar cadastrar usuario no banco de dados.", erro))
    })
    .then(response.json({ "query" : true }))
    .catch(erro => {
        console.error("Erro ao tentar cadastrar usuario no banco de dados.", erro)
        response.json({ "query" : false })
    })
    .finally(() => clientBancoDeDados.end())
})

router.delete('/', (request, response, next) => {
    /*let clientBancoDeDados = bancoDeDados.novoClient()
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then( async () => {
        await clientBancoDeDados.query("DELETE FROM usuarios WHERE usuario = $1", id_usuario)
        .catch(erro =>console.error("Erro ao tentar deletar cadastro no banco de dados.", erro))
    })
    .then(response.json({ "query" : true }))
    .catch(erro => {
        console.error("Erro ao tentar deletar cadastro no banco de dados.", erro)
        response.json({ "query" : false })
    })
    .finally(() => clientBancoDeDados.end())*/
    let usuario = request.body.usuario
    console.log("Tentativa de deletar o cadastro $1 no banco de dados", usuario)
    response.json({ "query" : false })
})

router.put('/', (request, response, next) => {
    let clientBancoDeDados = bancoDeDados.novoClient()
    let senha = request.body.senha
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(async () => {
        await clientBancoDeDados.query("UPDATE usuarios SET senha = $1 WHERE usuario = $2", [senha, usuario])
        .catch(erro =>console.error("Erro ao tentar editar cadastro no banco de dados.", erro))
    })
    .then(response.json({ "query" : true }))
    .catch(erro => {
        console.error("Erro ao tentar editar cadastro no banco de dados.", erro)
        response.json({ "query" : false })
    })
    .finally(() => clientBancoDeDados.end())
})

module.exports = router