const DATABASE_POSTGRE = process.env.DATABASE_POSTGRE
const HOST_POSTGRE = process.env.HOST_POSTGRE
const PASSWORD_POSTGRE = process.env.PASSWORD_POSTGRE
const PORT_POSTGRE = process.env.PORT_POSTGRE
const USER_POSTGRE = process.env.USER_POSTGRE
const SSL_POSTGRE = process.env.SSL_POSTGRE

const logs = require('../logs/logs')
const {Client} = require('pg')

function novoClient() {
    clientBancoDeDados = new Client({
        user: USER_POSTGRE,
        password: PASSWORD_POSTGRE,
        host: HOST_POSTGRE,
        port: PORT_POSTGRE,
        database: DATABASE_POSTGRE,
        ssl: SSL_POSTGRE
    })
    return clientBancoDeDados
}

function login(request, response) {
    let clientBancoDeDados = novoClient()
    let senha = request.body.senha
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("SELECT (senha = crypt($1, senha) AND senha = status) as autenticacao, status FROM usuarios WHERE usuario = $2", [senha, usuario]))
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
}

function logout(request, response) {
    let usuario = request.body.usuario
    logs.logout(usuario)
}

function getCadastro(request, response) {
    let clientBancoDeDados = novoClient()
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("SELECT usuario, status FROM usuarios WHERE usuario = $2", usuario))
    .then(resultado => {
        if (resultado.rows[0] === undefined) {
            response.json({ "usuario" : false })
        } else {
            response.json(resultado.rows[0])
        }
    })
    .catch(erro => console.error("Erro ao tentar conectar com o banco de dados.", erro))
    .finally(() => clientBancoDeDados.end())
}

function inserirCadastro(request, response) {
    let clientBancoDeDados = novoClient()
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
}

function deletarCadastro(request, response) {
    /*let clientBancoDeDados = novoClient()
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
}

function editarCadastro(request, response) {
    let clientBancoDeDados = novoClient()
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
}

module.exports.login = login
module.exports.logout = logout
module.exports.getCadastro = getCadastro
module.exports.inserirCadastro = inserirCadastro
module.exports.deletarCadastro = deletarCadastro
module.exports.editarCadastro = editarCadastro