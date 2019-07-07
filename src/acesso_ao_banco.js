const DATABASE_POSTGRE = process.env.DATABASE_POSTGRE
const HOST_POSTGRE = process.env.HOST_POSTGRE
const PASSWORD_POSTGRE = process.env.PASSWORD_POSTGRE
const PORT_POSTGRE = process.env.PORT_POSTGRE
const USER_POSTGRE = process.env.USER_POSTGRE
const SSL_POSTGRE = process.env.SSL_POSTGRE

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

function getProjetos(request, response) {
    let clientBancoDeDados = novoClient()
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("SELECT titulo, descricao, autor FROM projetos"))
    .then(resultados => response.json(resultados.rows))
    .catch(erro => console.error("Erro ao tentar conectar com o banco de dados.", erro))
    .finally(() => clientBancoDeDados.end())
}

function inserirProjeto(request, response) {
    let clientBancoDeDados = novoClient()
    let titulo = request.body.titulo
    let descricao = request.body.descricao
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("INSERT INTO projetos(titulo, descricao, autor) VALUES($1, $2, $3)", [titulo, descricao, usuario]))
    .then(response.json([{ "query" : "true" }]))
    .catch(erro => {
        console.error("Erro ao tentar cadastrar projeto no banco de dados.", erro)
        response.json([{ "query" : "false" }])
    })
    .finally(() => clientBancoDeDados.end())
}

function deletarProjeto(request, response) {
    let clientBancoDeDados = novoClient()
    let titulo = request.body.titulo
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("DELETE FROM projetos WHERE titulo = $1 AND usuario = $2", [titulo, usuario]))
    .then(response.json([{ "query" : "true" }]))
    .catch(erro => {
        console.error("Erro ao tentar deletar projeto no banco de dados.", erro)
        response.json([{ "query" : "false" }])
    })
    .finally(() => clientBancoDeDados.end())
}

function editarProjeto(request, response) {
    let clientBancoDeDados = novoClient()
    let titulo = request.body.titulo
    let tituloAntigo = request.body.tituloAntigo
    let descricao = request.body.descricao
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("UPDATE projetos SET titulo = $1, descricao = $2 WHERE titulo = $3 AND autor = $4", [titulo, descricao, tituloAntigo, usuario]))
    .then(response.json([{ "query" : "true" }]))
    .catch(erro => {
        console.error("Erro ao tentar editar projeto no banco de dados.", erro)
        response.json([{ "query" : "false" }])
    })
    .finally(() => clientBancoDeDados.end())
}

function login(request, response) {
    let clientBancoDeDados = novoClient()
    let senha = request.body.senha
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("SELECT senha = crypt($1, senha) as senha FROM usuarios WHERE login = $2", [senha, usuario]))
    .then(resultado => response.json(resultado.rows))
    .catch(erro => console.error("Erro ao tentar conectar com o banco de dados.", erro))
    .finally(() => clientBancoDeDados.end())
}

function inserirCadastro(request, response) {
    let clientBancoDeDados = novoClient()
    let senha = request.body.senha
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("INSERT INTO usuarios(login, senha) VALUES($1, crypt($2, gen_salt('bf')))", [usuario, senha]))
    .then(response.json([{ "query" : "true" }]))
    .catch(erro => {
        console.error("Erro ao tentar cadastrar usuario no banco de dados.", erro)
        response.json([{ "query" : "false" }])
    })
    .finally(() => clientBancoDeDados.end())
}

function deletarCadastro(request, response) {
    /*let clientBancoDeDados = novoClient()
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("DELETE FROM usuarios WHERE usuario = $1", usuario))
    .then(response.json([{ "query" : "true" }]))
    .catch(erro => {
        console.error("Erro ao tentar deletar cadastro no banco de dados.", erro)
        response.json([{ "query" : "false" }])
    })
    .finally(() => clientBancoDeDados.end())*/
    let usuario = request.body.usuario
    console.log("Tentativa de deletar o cadastro $1 no banco de dados", usuario)
    response.json([{ "query" : "false" }])
}

function editarCadastro(request, response) {
    let clientBancoDeDados = novoClient()
    let senha = request.body.senha
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("UPDATE usuarios SET senha = $1 WHERE usuario = $2", [senha, usuario]))
    .then(response.json([{ "query" : "true" }]))
    .catch(erro => {
        console.error("Erro ao tentar editar cadastro no banco de dados.", erro)
        response.json([{ "query" : "false" }])
    })
    .finally(() => clientBancoDeDados.end())
}

module.exports.getProjetos = getProjetos
module.exports.inserirProjeto = inserirProjeto
module.exports.deletarProjeto = deletarProjeto
module.exports.editarProjeto = editarProjeto
module.exports.login = login
module.exports.inserirCadastro = inserirCadastro
module.exports.deletarCadastro = deletarCadastro
module.exports.editarCadastro = editarCadastro