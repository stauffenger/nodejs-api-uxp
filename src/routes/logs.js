const express = require('express')
const router = express.Router()

const bancoDeDados = require('../acesso_ao_banco')

function login(usuario) {
    let log = "O usuário: " + usuario + ", logou no sistema."
    let operacao = "LOGIN"
    let tabela = "usuarios"
    return inserirLog(operacao, usuario, tabela, log)
}

function logout(usuario) {
    let log = "O usuário: " + usuario + ", deslogou do sistema."
    let operacao = "LOGOUT"
    let tabela = "usuarios"
    return inserirLog(operacao, usuario, tabela, log)
}

function inserirLog(operacao, usuario, tabela, log) {
    let clientBancoDeDados = bancoDeDados.novoClient()
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(async () => {
        let subquery = "(SELECT '" + operacao + "', agora(), id_usuario, '" + tabela + "', '" + log + "' FROM usuarios WHERE usuario like '" + usuario + "')"
        await clientBancoDeDados.query("INSERT INTO LOG(operacao, stamp, id_usuario, tabela, log)" + subquery)
        .catch(erro => console.error("Erro ao tentar inserir log no banco de dados.", erro))
    })
    .catch(erro => {
        console.error("Erro ao tentar inserir log no banco de dados.", erro)
        return false
    })
    .finally(() => clientBancoDeDados.end())
    return true
}

router.post('/', (request, response, next) => {
    let operacao = request.body.operacao
    let admin = request.body.admin
    if (admin === true) {
        let clientBancoDeDados = bancoDeDados.novoClient()
        clientBancoDeDados.connect()
        .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
        .then(() => clientBancoDeDados.query("SELECT id_log, operacao, stamp::varchar, id_usuario, tabela, log FROM log WHERE operacao = $1 ORDER BY stamp DESC", [operacao]))
        .then(resultados => response.json(resultados.rows))
        .catch(erro => console.error("Erro ao tentar pegar logs no banco de dados.", erro))
        .finally(() => clientBancoDeDados.end())
    }
})

module.exports = router
module.exports.login = login
module.exports.logout = logout