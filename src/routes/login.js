const express = require('express')
const router = express.Router()

const logs = require('./logs')
const bancoDeDados = require('../acesso_ao_banco')

router.post('/', (request, response, next) => {
    let clientBancoDeDados = bancoDeDados.novoClient()
    let senha = request.body.senha
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("SELECT (senha = crypt($1, senha) AND status) as autenticacao, status FROM usuarios WHERE usuario = $2", [senha, usuario]))
    .then(resultado => {
        logs.login(usuario)
        if (resultado.rows[0] === undefined) {
            response.json({ "autenticacao" : false, "status" : null })
        } else {
            response.json(resultado.rows[0])
        }
    })
    .catch(erro => console.error("Erro ao tentar conectar com o banco de dados.", erro))
    .finally(() => clientBancoDeDados.end())
})

module.exports = router